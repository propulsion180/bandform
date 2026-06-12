package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.BandPositionRepository;
import xyz.wmmp.bandform_backend.repositories.BandRepository;

import java.util.List;

@Service
public class BandPositionService {

    private final BandService bandService;
    private final InstrumentService instrumentService;
    private final BandPositionRepository bandPositionRepository;

    @Autowired
    public BandPositionService(BandService bandService, InstrumentService instrumentService, BandPositionRepository bandPositionRepository){
        this.bandService = bandService;
        this.instrumentService = instrumentService;
        this.bandPositionRepository = bandPositionRepository;
    }

    public BandPosition createBandPosition(Long bandId, String instrumentName, String description){
        Band b = bandService.getBandById(bandId);
        Instrument i = instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(instrumentName)).getFirst();
        BandPosition bp = new BandPosition();
        bp.setBand(b);
        bp.setInstrument(i);
        bp.setDescription(description);

        return bandPositionRepository.save(bp);
    }

    public boolean clearUsersBandPositions(Long userid){
        List<BandPosition> bps = bandPositionRepository.findByUserIDIn(userid).orElse(null);

        if(bps == null){return false;}

        bandPositionRepository.deleteAll(bps);
        return true;

        //needs logging.
    }

   //add update serivce

}
