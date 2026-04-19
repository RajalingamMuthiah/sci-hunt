package com.scientishunt.assessment.dto;

import java.util.List;

import com.scientishunt.assessment.model.QuestionType;

public record QuestionResponse(String id,String subject,String difficulty,QuestionType type,String questionText,List<String>options,String correctAnswer,String explanation){}
