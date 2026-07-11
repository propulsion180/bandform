package xyz.wmmp.bandform_backend.services;

import org.hibernate.mapping.Join;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.JoinRequestRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final UserService userService;
    private final BandService bandService;
    private final BandPositionService bandPositionService;
    private final InstrumentService instrumentService;
    private final BandMemberService bandMemberService;

    @Autowired
    public JoinRequestService(JoinRequestRepository joinRequestRepository, UserService userService, BandService bandService, BandPositionService bandPositionService, InstrumentService instrumentService, BandMemberService bandMemberService){
        this.joinRequestRepository = joinRequestRepository;
        this.userService = userService;
        this.bandService = bandService;
        this.bandPositionService = bandPositionService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
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
        jr.setUser(userService.getUserById(userId));
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
        return jr;
    }

    public Long reject(Long jRID){
        JoinRequest jr = joinRequestRepository.findById(jRID).orElse(null);
        if(jr == null){/*log stuff*/}
        jr.setStatus(RequestStatus.REJECTED);
        joinRequestRepository.save(jr);
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
        return jRID;// notify hook for notifications
    }


}
