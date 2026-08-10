package xyz.wmmp.bandform_backend.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.wmmp.bandform_backend.data.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByBandIdOrderByIdDesc(Long bandId, Pageable pageable);

    List<Message> findByBandIdAndIdLessThanOrderByIdDesc(Long bandId, Long id, Pageable pageable);
}
