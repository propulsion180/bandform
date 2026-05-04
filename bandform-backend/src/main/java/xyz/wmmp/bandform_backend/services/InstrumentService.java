package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.repositories.InstrumentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class InstrumentService {
        private static final Logger log = LoggerFactory.getLogger(InstrumentService.class);
        private final InstrumentRepository instrumentRepository;

        @Autowired
        public InstrumentService(InstrumentRepository instrumentRepository){
            this.instrumentRepository = instrumentRepository;
        }

        public List<Instrument> getInstrumentsByNameAndAddIfNecessary(List<String> instrumentNames){

                List<Instrument> existingInstruments = instrumentRepository.findByNameIn(instrumentNames);
                Set<String> existingInstrumentNames = existingInstruments.stream().map(Instrument::getName).collect(Collectors.toSet());
                List<String> missingInstrumentNames = instrumentNames.stream().filter(n -> !existingInstrumentNames.contains(n)).collect(Collectors.toList());

                List<Instrument> newInstrument = missingInstrumentNames.stream()
                        .map(n -> {
                                Instrument i = new Instrument();
                                i.setName(n);
                                return i;
                        })
                        .collect(Collectors.toList());

                if(!newInstrument.isEmpty()){
                        instrumentRepository.saveAll(newInstrument);
                }

                List<Instrument> allI = new ArrayList<>(existingInstruments);
                allI.addAll(newInstrument);

                return allI;
        }
}
