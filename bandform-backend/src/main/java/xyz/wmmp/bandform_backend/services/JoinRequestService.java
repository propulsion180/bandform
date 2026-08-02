package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.JoinRequestRepository;
import xyz.wmmp.bandform_backend.repositories.NotificationRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final UserService userService;
    private final BandService bandService;
    private final BandPositionService bandPositionService;
    private final InstrumentService instrumentService;
    private final BandMemberService bandMemberService;
    private final NotificationRepository notificationRepository;
    private final NotificationPublisher notificationPublisher;
    private final BandAuthorizationService bandAuthorizationService;

    @Autowired
    public JoinRequestService(JoinRequestRepository joinRequestRepository, UserService userService, BandService bandService, BandPositionService bandPositionService, InstrumentService instrumentService, BandMemberService bandMemberService, NotificationRepository notificationRepository, NotificationPublisher notificatonPublisher, BandAuthorizationService bandAuthorizationService){
        this.joinRequestRepository = joinRequestRepository;
        this.userService = userService;
        this.bandService = bandService;
        this.bandPositionService = bandPositionService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
        this.notificationRepository = notificationRepository;
        this.notificationPublisher = notificatonPublisher;
        this.bandAuthorizationService = bandAuthorizationService;
    }

    public List<JoinRequest> getAllJoinRequests(Long id){
        return joinRequestRepository.findAll();
    }

    public List<JoinRequest> getUserJoinRequests(Long uID){
        bandAuthorizationService.requireSelf(uID);
        return joinRequestRepository.findByUserId(uID).orElseThrow(() -> new NoSuchElementException("No joinRequests reffering to user " + uID));
    }

    public List<JoinRequest> getBandJoinRequests(Long bID){
        bandAuthorizationService.requireBandManager(bandService.getBandById(bID));
        return joinRequestRepository.findByBandId(bID).orElseThrow(() -> new NoSuchElementException("No joinRequests refering to the band " + bID));
    }

    public JoinRequest getJoinRequestById(Long id){
        return joinRequestRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No joinRequest with ID " + id));
    }

    public Long deleteJoinRequestById(Long id){
        JoinRequest jr = getJoinRequestById(id);
        boolean allowed = bandAuthorizationService.isSelf(jr.getUser().getId())
                || bandAuthorizationService.isBandManager(jr.getBand());
        if (!allowed) {
            throw new org.springframework.security.access.AccessDeniedException("You can only withdraw your own request or cancel your own band's invitation.");
        }
        joinRequestRepository.deleteById(id);
        return id;
        //find a better options rather than boolean.
    }

    public JoinRequest createJoinRequest(Long userId, Long bandId, Long positionId, List<String> interestedInstruments, String message){
        bandAuthorizationService.requireSelf(userId);

        JoinRequest jr = new JoinRequest();
        User requester = userService.getUserById(userId);
        jr.setUser(requester);
        Band b = bandService.getBandById(bandId);
        jr.setBand(b);
        jr.setPosition(bandPositionService.getBandPositionById(positionId));
        jr.setInterestedInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(interestedInstruments));
        jr.setMessage(message);
        jr.setRequestedDate(LocalDateTime.now());
        jr.setInvitedByBand(false);
        jr = joinRequestRepository.save(jr);
        List<JoinRequest> toUpdate = b.getJoinRequests();
        toUpdate.add(jr);
        bandService.updateBand(bandId, null, null, null, null, null, null, null, toUpdate);
        List<User> toNotify = b.getMembers().stream().map(m -> m.getUser()).collect(Collectors.toList());

        StringBuilder s = new StringBuilder();
        interestedInstruments.forEach(ii -> s.append(ii));

        toNotify.forEach((u) -> {
            Notification n = new Notification();
            n.setUser(u);
            n.setMessage("New join request from " + requester.getName() +  ". " + requester.getName() + " is interested in playing one or more of these instruments" + s );
            n.setRead(false);
            n.setSender(requester.getName());
            notificationRepository.save(n);
            notificationPublisher.publish(u.getId(), n);
        });


        return jr;
    }

    public JoinRequest inviteToBand(Long bandId, Long positionId, Long candidateUserId, String proposedRole, String message){
        Band b = bandService.getBandById(bandId);
        bandAuthorizationService.requireBandManager(b);

        BandPosition position = bandPositionService.getBandPositionById(positionId);

        JoinRequest jr = new JoinRequest();
        User candidate = userService.getUserById(candidateUserId);
        jr.setUser(candidate);
        jr.setBand(b);
        jr.setPosition(position);
        jr.setInterestedInstruments(List.of(position.getInstrument()));
        jr.setMessage(message);
        jr.setRequestedDate(LocalDateTime.now());
        jr.setInvitedByBand(true);
        jr.setProposedRole(proposedRole);
        jr = joinRequestRepository.save(jr);
        List<JoinRequest> toUpdate = b.getJoinRequests();
        toUpdate.add(jr);
        bandService.updateBand(bandId, null, null, null, null, null, null, null, toUpdate);

        Notification n = new Notification();
        n.setUser(candidate);
        n.setMessage(b.getName() + " invited you to join as " + proposedRole + ".");
        n.setRead(false);
        n.setSender(b.getName());
        notificationRepository.save(n);
        notificationPublisher.publish(candidate.getId(), n);

        return jr;
    }

    public Long reject(Long jRID){
        JoinRequest jr = getJoinRequestById(jRID);

        if (jr.isInvitedByBand()) {
            bandAuthorizationService.requireSelf(jr.getUser().getId());
        } else {
            bandAuthorizationService.requireBandManager(jr.getBand());
        }

        jr.setStatus(RequestStatus.REJECTED);
        joinRequestRepository.save(jr);

        Notification n = new Notification();
        n.setUser(jr.getUser());
        n.setMessage("Sorry " + jr.getUser().getName() + " but your request to join " + jr.getBand().getName() + " has been rejected");
        n.setRead(false);
        n.setSender(jr.getBand().getName());
        notificationRepository.save(n);
        notificationPublisher.publish(jr.getUser().getId(), n);
        return jRID;// notify hook for notifications
    }

    public Long accept(Long jRID, String bandRole){
        JoinRequest jr = getJoinRequestById(jRID);

        if (jr.isInvitedByBand()) {
            bandAuthorizationService.requireSelf(jr.getUser().getId());
        } else {
            bandAuthorizationService.requireBandManager(jr.getBand());
        }

        String role = (bandRole != null && !bandRole.isBlank()) ? bandRole : jr.getProposedRole();

        jr.setStatus(RequestStatus.ACCEPTED);
        joinRequestRepository.save(jr);

        //create bandmember and add to band
        Band b = jr.getBand();
        BandMember bm = bandMemberService.createBandMember(b, jr.getUser(), new ArrayList<>(jr.getInterestedInstruments()), role);

        if (jr.getPosition() != null) {
            bandPositionService.updateBandPosition(jr.getPosition().getId(), null, null, null, true, jr.getUser());
            resolveCompetingRequests(jr.getPosition().getId(), jr.getId());
        }

        Notification n = new Notification();
        n.setUser(jr.getUser());
        n.setMessage(jr.getUser().getName() + ", you have been accepted as a " + bm.getRole() + " for " + jr.getBand().getName());
        n.setRead(false);
        n.setSender(jr.getBand().getName());
        notificationRepository.save(n);
        notificationPublisher.publish(jr.getUser().getId(), n);

        return jRID;// notify hook for notifications
    }

    private void resolveCompetingRequests(Long positionId, Long acceptedRequestId){
        List<JoinRequest> competing = joinRequestRepository.findByPositionId(positionId).orElse(List.of());
        for (JoinRequest other : competing) {
            if (other.getId().equals(acceptedRequestId) || other.getStatus() != RequestStatus.PENDING) {
                continue;
            }
            other.setStatus(RequestStatus.REJECTED);
            joinRequestRepository.save(other);

            Notification n = new Notification();
            n.setUser(other.getUser());
            n.setMessage("The " + other.getPosition().getInstrument().getName() + " position for " + other.getBand().getName() + " has been filled by someone else.");
            n.setRead(false);
            n.setSender(other.getBand().getName());
            notificationRepository.save(n);
            notificationPublisher.publish(other.getUser().getId(), n);
        }
    }


}
