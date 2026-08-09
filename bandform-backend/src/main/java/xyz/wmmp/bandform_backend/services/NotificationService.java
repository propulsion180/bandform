package xyz.wmmp.bandform_backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import xyz.wmmp.bandform_backend.repositories.NotificationRepository;
import xyz.wmmp.bandform_backend.data.Notification;

@Service
public class NotificationService{
  private final NotificationRepository notificationRepository;

  @Autowired
  public NotificationService(NotificationRepository notificationRepository){
    this.notificationRepository = notificationRepository;
  }


  public List<Notification> getUnreadNotifications(Long userId){
    return notificationRepository.findByUserIdAndReadFalse(userId);
  }

  public void markAsRead(Long id){
    notificationRepository.findById(id).ifPresent(n -> {
      n.setRead(true);
      notificationRepository.save(n);
    });
  }
}
