package xyz.wmmp.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Message;
import xyz.wmmp.bandform_backend.repositories.MessageRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {
    private static final int DEFAULT_LIMIT = 50;
    private static final int MAX_LIMIT = 100;

    private final MessageRepository messageRepository;
    private final BandService bandService;
    private final UserService userService;

    @Autowired
    public MessageService(MessageRepository messageRepository, BandService bandService, UserService userService) {
        this.messageRepository = messageRepository;
        this.bandService = bandService;
        this.userService = userService;
    }

    public Message sendMessage(Long bandId, Long senderId, String body) {
        Message m = new Message();
        m.setBand(bandService.getBandById(bandId));
        m.setSender(userService.getUserById(senderId));
        m.setBody(body);
        m.setSentAt(LocalDateTime.now());
        return messageRepository.save(m);
    }

    public List<Message> getBandMessages(Long bandId, Integer limit, Long beforeId) {
        int size = (limit == null || limit <= 0 || limit > MAX_LIMIT) ? DEFAULT_LIMIT : limit;
        Pageable page = PageRequest.of(0, size);

        List<Message> results = beforeId != null
                ? messageRepository.findByBandIdAndIdLessThanOrderByIdDesc(bandId, beforeId, page)
                : messageRepository.findByBandIdOrderByIdDesc(bandId, page);

        Collections.reverse(results);
        return results;
    }
}
