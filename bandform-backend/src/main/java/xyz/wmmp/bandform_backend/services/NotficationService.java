package xyz.wmmp.bandform_backend.services;

import java.awt.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import xyz.wmmp.bandform_backend.repositories.NotificationRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.data.Notification;
import xyz.wmmp.bandform_backend.data.User;

@Service
public class NotificationService{
  private final NotificationRepository notificationRepository;
  private final UserService userService;

  @Autowired
  public NotificationService(NotificationRepository notificationRepository, UserService userService){
    this.notificationRepository = notificationRepository;
    this.userService = userService;
  }


  public Notification createNotification(User u, String from, String message){
    Notification n = new Notification();

    n.setUser(u);
    n.setFrom(from);
    n.setMessage(message);

    n = notificationRepository.save(n);
    List<Notification> toUpdate = u.getNotifications();
    toUpdate.add(n);
    userService.updateUser(u.getId(), null, null, null, null, null, null, null, null, null, null, null, toUpdate);
  }

  public Long deleteNotification(Long id){
    Notification n = notificationRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No notification with this ID " + id));

    List<Notification> toUpdate = n.getUser().getNotifications();
    toUpdate.remove(n);

    userService.updateUser(n.getUser().getId(), null, null, null, null, null, null, null, null, null, null, toUpdate);

    notificationRepository.deleteById(id);
  }
  
  
}
