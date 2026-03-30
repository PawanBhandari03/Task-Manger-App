package com.pawan.task.mappers;

import com.pawan.task.domain.dto.TaskListDto;
import com.pawan.task.domain.entites.Task;
import com.pawan.task.domain.entites.TaskList;
import com.pawan.task.domain.entites.TaskStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TaskListMapperImpl implements TaskListMapper {

    private final TaskMapper taskMapper;

    public TaskListMapperImpl(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    @Override
    public TaskList fromDto(TaskListDto taskListDto) {
        return new TaskList(
                taskListDto.id(),
                taskListDto.title(),
                taskListDto.description(),
                Optional.ofNullable(taskListDto.Tasks())
                        .map(tasks -> tasks.stream()
                                .map(taskMapper::fromDto)
                                .toList()
                        ).orElse(null),
                null,
                null
        );
    }

    @Override
    public TaskListDto toDto(TaskList tasklist) {
        return new TaskListDto(
                tasklist.getId(),
                tasklist.getTitle(),
                tasklist.getDescription(),
                Optional.ofNullable(tasklist.getTasks())
                        .map(List::size)
                        .orElse(0),
                calculateTaskListProgress(tasklist.getTasks()),
                Optional.ofNullable(tasklist.getTasks())
                        .map(tasks -> tasks.stream().map(taskMapper::toDto).toList()
                        ).orElse(null)
        );
    }

    private Double calculateTaskListProgress(List<Task> tasks) {
        if (null == tasks) {
            return null;
        }
        long closedTaskCount = tasks.stream().filter(task ->
                TaskStatus.CLOSED == task.getStatus()
        ).count();
        return (double) closedTaskCount / tasks.size();

    }
}
