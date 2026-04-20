package com.scientishunt.assessment.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    @Indexed
    @Field("subject")
    private String subject;

    @Indexed
    @Field("difficulty")
    private String difficulty;

    @Indexed
    @Field("type")
    private QuestionType type;

    @Field("question_text")
    private String questionText;

    @Field("question_image_url")
    private String questionImageUrl;

    @Field("options")
    private List<Option> options;

    @Field("correct_answer")
    private String correctAnswer;

    @Field("correct_bool_answer")
    private Boolean correctBoolAnswer;

    @Field("model_answer")
    private String modelAnswer;

    @Field("max_words")
    private Integer maxWords;

    @Field("explanation")
    private String explanation;

    @Field("marks")
    private Double marks;

    @Field("tags")
    private List<String> tags;

    @Field("grade")
    private Integer grade;

    @Field("topic_id")
    private String topicId;

    @Field("subject_id")
    private String subjectId;

    public static class Option {
        private String id;
        private String text;
        private String imageUrl;
        private boolean correct;

        public Option() {}

        public Option(String id, String text, String imageUrl, boolean correct) {
            this.id = id;
            this.text = text;
            this.imageUrl = imageUrl;
            this.correct = correct;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public boolean isCorrect() { return correct; }
        public void setCorrect(boolean correct) { this.correct = correct; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public QuestionType getType() { return type; }
    public void setType(QuestionType type) { this.type = type; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getQuestionImageUrl() { return questionImageUrl; }
    public void setQuestionImageUrl(String questionImageUrl) { this.questionImageUrl = questionImageUrl; }
    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }
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
    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
}
