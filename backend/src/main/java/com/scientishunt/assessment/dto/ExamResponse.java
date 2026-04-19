package com.scientishunt.assessment.dto;

import java.util.List;

public record ExamResponse(String id,String title,int duration,int totalMarks,List<QuestionResponse>questions){}
