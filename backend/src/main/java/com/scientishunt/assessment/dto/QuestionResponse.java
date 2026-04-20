package com.scientishunt.assessment.dto;

import java.util.List;

import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;

public record QuestionResponse(
        String id,
        String subject,
        String subjectId,
        String topicId,
        String difficulty,
        QuestionType type,
        Integer grade,
        String questionText,
        String questionImageUrl,
        List<Question.Option> options,
        String correctAnswer,
        Boolean correctBoolAnswer,
        String modelAnswer,
        Integer maxWords,
        String explanation,
        Double marks,
        List<String> tags) {
}
