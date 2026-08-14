package com.usedvehicle.service;

import com.usedvehicle.dto.NotificationResponse;
import com.usedvehicle.entity.Notification;
import com.usedvehicle.entity.User;
import com.usedvehicle.repository.NotificationRepository;
import com.usedvehicle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createNotification(User recipient, String title, String content) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setContent(content);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return notificationRepository.findByRecipientId(user.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markAsRead(UUID id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));

        if (!n.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not authorized to access this notification.");
        }

        n.setIsRead(true);
        Notification saved = notificationRepository.save(n);
        return convertToResponse(saved);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        List<Notification> list = notificationRepository.findByRecipientId(user.getId());
        for (Notification n : list) {
            if (Boolean.FALSE.equals(n.getIsRead())) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        }
    }

    private NotificationResponse convertToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getIsRead(),
                n.getCreatedAt()
        );
    }
}
