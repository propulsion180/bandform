package xyz.wmmp.bandform_backend.repositories;

import xyz.wmmp.bandform_backend.data.Notification;;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long>{
  
}
