package com.pawan.task.mappers;

import com.pawan.task.domain.dto.TaskListDto;
import com.pawan.task.domain.entites.TaskList;

public interface TaskListMapper {
    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList tasklist);
}
