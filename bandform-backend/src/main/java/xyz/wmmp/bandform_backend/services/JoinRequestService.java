package xyz.wmmp.bandform_backend.services;

import org.apache.logging.log4j.util.StringBuilderFormattable;
import org.hibernate.mapping.Join;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.NotificationListenerBean;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.JoinRequestRepository;
import xyz.wmmp.bandform_backend.repositories.NotificationRepository;

import java.time.LocalDateTime;
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

    @Autowired
    public JoinRequestService(JoinRequestRepository joinRequestRepository, UserService userService, BandService bandService, BandPositionService bandPositionService, InstrumentService instrumentService, BandMemberService bandMemberService, NotificationRepository notificationRepository, NotificationPublisher notificatonPublisher){
        this.joinRequestRepository = joinRequestRepository;
        this.userService = userService;
        this.bandService = bandService;
        this.bandPositionService = bandPositionService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
        this.notificationRepository = notificationRepository;
        this.notificationPublisher = notificatonPublisher;
    }

    public List<JoinRequest> getAllJoinRequests(Long id){
        return joinRequestRepository.findAll();
    }

    public List<JoinRequest> getUserJoinRequests(Long uID){
        return joinRequestRepository.findByUserId(uID).orElseThrow(() -> new NoSuchElementException("No joinRequests reffering to user " + uID));
    }

    public List<JoinRequest> getBandJoinRequests(Long bID){
        return joinRequestRepository.findByBandId(bID).orElseThrow(() -> new NoSuchElementException("No joinRequests refering to the band " + bID));
    }

    public JoinRequest getJoinRequestById(Long id){
        return joinRequestRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No joinRequest with ID " + id));
    }

    public Long deleteJoinRequestById(Long id){
        joinRequestRepository.deleteById(id);
        return id;
        //find a better options rather than boolean.
    }

    public JoinRequest createJoinRequest(Long userId, Long bandId, Long positionId, List<String> interestedInstruments, String message){
        JoinRequest jr = new JoinRequest();
        User requester = userService.getUserById(userId);
        jr.setUser(requester);
        Band b = bandService.getBandById(bandId);
        jr.setBand(b);
        jr.setPosition(bandPositionService.getBandPositionById(positionId));
        jr.setInterestedInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(interestedInstruments));
        jr.setMessage(message);
        jr.setRequestedDate(LocalDateTime.now());
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
        });
        
        
        return jr;
    }

    public Long reject(Long jRID){
        JoinRequest jr = joinRequestRepository.findById(jRID).orElse(null);
        if(jr == null){/*log stuff*/}
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
        JoinRequest jr = joinRequestRepository.findById(jRID).orElse(null);
        if(jr == null){/*log stuff*/ }
        jr.setStatus(RequestStatus.ACCEPTED);
        joinRequestRepository.save(jr);

        //create bandmember and add to band
        Band b = jr.getBand();
        BandMember bm = bandMemberService.createBandMember(b, jr.getUser(), jr.getInterestedInstruments(), bandRole);

        Notification n = new Notification();
        n.setUser(jr.getUser());
        n.setMessage(jr.getUser().getName() + ", you have been accepted as a " + bm.getRole() + " for " + jr.getBand().getName());
        n.setRead(false);
        n.setSender(jr.getBand().getName());
        notificationRepository.save(n);
        notificationPublisher.publish(jr.getUser().getId(), n);
        
        return jRID;// notify hook for notifications
    }


}
