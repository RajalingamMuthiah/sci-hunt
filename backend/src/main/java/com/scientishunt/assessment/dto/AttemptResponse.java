package com.scientishunt.assessment.dto;

import java.time.Instant;
import java.util.Map;

public record AttemptResponse(String id,String examId,String userId,Map<String,String>answers,double score,Instant createdAt){}
