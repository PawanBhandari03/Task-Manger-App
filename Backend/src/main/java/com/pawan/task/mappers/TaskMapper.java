package com.pawan.task.mappers;

import com.pawan.task.domain.dto.TaskDto;
import com.pawan.task.domain.entites.Task;

public interface TaskMapper {
    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);
}
