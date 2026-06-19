package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.BandMemberRepository;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BandMemberService {

    private final BandMemberRepository bandMemberRepository;
    private final UserRepository userRepository;
    private final BandRepository bandRepository;
    private final InstrumentService instrumentService;

    @Autowired
    public BandMemberService(BandMemberRepository bandMemberRepository, UserRepository userRepository, BandRepository bandRepository, InstrumentService instrumentService){
        this.bandMemberRepository = bandMemberRepository;
        this.userRepository = userRepository;
        this.bandRepository = bandRepository;
        this.instrumentService = instrumentService;
    }

    public List<BandMember> membersInBand(Long bandId){
        return bandMemberRepository.findByBandNameIn(bandId).orElse(null);
    }

    public BandMember createBandMember(Long bandId, Long userId, List<String> instrumentNames, String role){
        BandMember bm = new BandMember();
        User u = userRepository.findById(userId).orElse(null);
        bm.setUser(u);
        Band b = bandRepository.findById(bandId).orElse(null);
        bm.setBand(b);
        List<Instrument> i = instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames);
        bm.setInstruments(i);
        bm.setJoinedDate(LocalDateTime.now());
        bm.setRole(role);
        return bandMemberRepository.save(bm);
    }

    public Long removeMember(Long memberId){
        bandMemberRepository.deleteById(memberId);
        return memberId;
    }

}
