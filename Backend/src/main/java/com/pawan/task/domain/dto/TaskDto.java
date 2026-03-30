package com.pawan.task.domain.dto;

import com.pawan.task.domain.entites.TaskPriority;
import com.pawan.task.domain.entites.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
)
{

}
