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

    public BandPosition getBandPositionById(Long bPId){
        return bandPositionRepository.findById(bPId).orElse(null);
    }

    public List<BandPosition> getBandPositionsInBand(Long bId){
        return bandPositionRepository.findByBandId(bId).orElse(null);
    }

    public BandPosition createBandPosition(Long bandId, String instrumentName, String description){
        Band b = bandService.getBandById(bandId);
        Instrument i = instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(instrumentName)).getFirst();
        BandPosition bp = new BandPosition();
        bp.setBand(b);
        bp.setInstrument(i);
        bp.setDescription(description);
        bp = bandPositionRepository.save(bp);
        List<BandPosition> toUpdate = b.getOpenPositions();
        toUpdate.add(bp);
        bandService.updateBand(b.getId(), null, null, null, null, null, null , toUpdate, null);
        return bp;
    }

    public BandPosition createBandPosition(Band b, Instrument i, String description){
        BandPosition bp = new BandPosition();
        bp.setBand(b);
        bp.setInstrument(i);
        bp.setDescription(description);
        bp = bandPositionRepository.save(bp);
        List<BandPosition> toUpdate = b.getOpenPositions();
        toUpdate.add(bp);
        bandService.updateBand(b.getId(), null, null, null, null, null, null , toUpdate, null);
        return bp;
    }


   public Long updateBandPosition(Long bpId, Band band,  String instrument, String description, boolean filled, User filler){
        BandPosition bp = bandPositionRepository.findById(bpId).orElse(null);
        if(bp == null){return null;}

        if(band != null && band != null){bp.setBand(band);}
        if(instrument != null && !instrument.isBlank()){bp.setInstrument(instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(instrument)).getFirst());}
        if(description != null && !description.isBlank()){bp.setDescription(description);}
        bp.setFilled(filled);
        if(filler != null && !filler.equals(bp.getFilledBy())){bp.setFilledBy(filler);}
        bandPositionRepository.save(bp);
        return bpId;
        //this kinda sucks. why returning true?
   }

   public Long deleteBandPosition(Long bpId){ //should not need this after first setup.
        BandPosition bp = bandPositionRepository.findById(bpId).orElse(null);
        if(bp == null){return null;}
        Band b = bp.getBand();
        List<BandPosition> toUpdate = b.getOpenPositions();
        toUpdate.remove(bp);
        bandService.updateBand(b.getId(), null, null, null, null, null, null , toUpdate, null);
        bandPositionRepository.deleteById(bpId);
        return bpId;
   }

}
