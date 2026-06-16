package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.JoinRequest;
import xyz.wmmp.bandform_backend.data.RequestStatus;
import xyz.wmmp.bandform_backend.repositories.JoinRequestRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JoinRequestService {

    public final JoinRequestRepository joinRequestRepository;
    public final UserService userService;
    public final BandService bandService;
    public final BandPositionService bandPositionService;
    public final InstrumentService instrumentService;

    @Autowired
    public JoinRequestService(JoinRequestRepository joinRequestRepository, UserService userService, BandService bandService, BandPositionService bandPositionService, InstrumentService instrumentService){
        this.joinRequestRepository = joinRequestRepository;
        this.userService = userService;
        this.bandService = bandService;
        this.bandPositionService = bandPositionService;
        this.instrumentService = instrumentService;
    }

    public List<JoinRequest> getAllJoinRequests(Long id){
        return joinRequestRepository.findAll();
    }

    public JoinRequest getJoinRequestById(Long id){
        return joinRequestRepository.findById(id).orElse(null);
    }

    public boolean deleteJoinRequestById(Long id){
        joinRequestRepository.deleteById(id);
        return true;
        //find a better options rather than boolean.
    }

    public JoinRequest createJoinRequest(Long userId, Long bandId, Long positionId, List<String> interestedInstruments, String message){
        JoinRequest jr = new JoinRequest();
        jr.setUser(userService.getUserById(userId));
        jr.setBand(bandService.getBandById(bandId));
        jr.setPosition(bandPositionService.getBandPositionById(positionId));
        jr.setInterestedInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(interestedInstruments));
        jr.setMessage(message);
        jr.setRequestedDate(LocalDateTime.now());
        return joinRequestRepository.save(jr);
    }

    public void reject(Long jRID){
        JoinRequest jr = joinRequestRepository.findById(jRID).orElse(null);
        if(jr == null){/*log stuff*/ }
        jr.setStatus(RequestStatus.REJECTED);
        joinRequestRepository.save(jr);
        // notify hook for notifications
    }

    public void accept(Long jRID){
        JoinRequest jr = joinRequestRepository.findById(jRID).orElse(null);
        if(jr == null){/*log stuff*/ }
        jr.setStatus(RequestStatus.ACCEPTED);
        joinRequestRepository.save(jr);
        // notify hook for notifications
    }


}
