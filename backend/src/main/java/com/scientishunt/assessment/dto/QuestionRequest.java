package com.scientishunt.assessment.dto;

import java.util.List;

import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuestionRequest {

    @NotBlank
    private String subject;

    private String subjectId;
    private String topicId;

    @NotBlank
    private String difficulty;

    @NotNull
    private QuestionType type;

    private Integer grade;

    @NotBlank
    private String questionText;

    private String questionImageUrl;

    private List<Question.Option> options;

    private String correctAnswer;

    private Boolean correctBoolAnswer;

    private String modelAnswer;

    private Integer maxWords;

    private String explanation;

    private Double marks;

    private List<String> tags;

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public QuestionType getType() { return type; }
    public void setType(QuestionType type) { this.type = type; }
    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getQuestionImageUrl() { return questionImageUrl; }
    public void setQuestionImageUrl(String questionImageUrl) { this.questionImageUrl = questionImageUrl; }
    public List<Question.Option> getOptions() { return options; }
    public void setOptions(List<Question.Option> options) { this.options = options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public Boolean getCorrectBoolAnswer() { return correctBoolAnswer; }
    public void setCorrectBoolAnswer(Boolean correctBoolAnswer) { this.correctBoolAnswer = correctBoolAnswer; }
    public String getModelAnswer() { return modelAnswer; }
    public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }
    public Integer getMaxWords() { return maxWords; }
    public void setMaxWords(Integer maxWords) { this.maxWords = maxWords; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
