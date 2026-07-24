package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.BandMemberRepository;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BandMemberService {

    private final BandMemberRepository bandMemberRepository;
    private final UserRepository userRepository;
    private final BandRepository bandRepository;
    private final InstrumentService instrumentService;
    private final BandService bandService;

    @Autowired
    public BandMemberService(BandMemberRepository bandMemberRepository, UserRepository userRepository, BandRepository bandRepository, InstrumentService instrumentService, BandService bandService){
        this.bandMemberRepository = bandMemberRepository;
        this.userRepository = userRepository;
        this.bandRepository = bandRepository;
        this.instrumentService = instrumentService;
        this.bandService = bandService;
    }

    public List<BandMember> membersInBand(Long bandId){
        return bandMemberRepository.findByBandId(bandId).orElseThrow(() -> new NoSuchElementException("No bandmembers in band with Id " + bandId));
    }

    public BandMember createBandMember(Band band, User user, List<Instrument> instruments, String role){
        BandMember bm = new BandMember();
        bm.setUser(user);
        bm.setBand(band);
        bm.setInstruments(instruments);
        bm.setJoinedDate(LocalDateTime.now());
        bm.setRole(role);
        bm = bandMemberRepository.save(bm);
        List<BandMember> toUpdate = band.getMembers();
        toUpdate.add(bm);
        bandService.updateBand(band.getId(), null, null, null, null, null, toUpdate, null, null);
        return bm;
    }

    public BandMember createBandMember(Long bandId, Long userId, List<String> instrumentNames, String role){
        BandMember bm = new BandMember();
        User u = userRepository.findById(userId).orElse(null);
        u.setStatus(UserStatus.BAND);
        bm.setUser(u);
        Band b = bandService.getBandById(bandId);
        bm.setBand(b);
        List<Instrument> i = instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames);
        bm.setInstruments(i);
        bm.setJoinedDate(LocalDateTime.now());
        bm.setRole(role);
        bm = bandMemberRepository.save(bm);
        List<BandMember> toUpdate = b.getMembers();
        toUpdate.add(bm);
        bandService.updateBand(b.getId(), null, null, null, null, null, toUpdate, null, null);
        return bm;
    }

    public Long removeMember(Long memberId){
        BandMember bm = bandMemberRepository.findById(memberId).orElseThrow(() -> new NoSuchElementException("Couldn't find member to delete. Maybe deleted already  " + memberId));
        if(bm == null){return null;}
        Band b = bm.getBand();
        List<BandMember> toUpdate = b.getMembers();
        toUpdate.remove(bm);
        bandService.updateBand(b.getId(), null, null, null, null, null, toUpdate, null, null);
        bandMemberRepository.deleteById(memberId);
        return memberId;
    }

}
