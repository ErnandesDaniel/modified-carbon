package ru.main.back.mappers;

import org.mapstruct.Mapper;
import ru.main.back.dto.noteDto.NoteResponseDto;
import ru.main.back.entities.Note;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    NoteResponseDto toResponseDto(Note entity);
}
