package com.scientishunt.assessment.service;

import java.util.List;

import com.scientishunt.assessment.dto.QuestionRequest;
import com.scientishunt.assessment.dto.QuestionResponse;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import com.scientishunt.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuestionResponse> findAll(boolean includeAnswers) {
        return questionRepository.findAll().stream()
                .map(q -> toResponse(q, includeAnswers))
                .toList();
    }

    public List<QuestionResponse> findBySubject(String subject, boolean includeAnswers) {
        return questionRepository.findBySubjectIgnoreCase(subject).stream()
                .map(q -> toResponse(q, includeAnswers))
                .toList();
    }

    public List<QuestionResponse> findByType(QuestionType type, boolean includeAnswers) {
        return questionRepository.findByType(type).stream()
                .map(q -> toResponse(q, includeAnswers))
                .toList();
    }

    public List<QuestionResponse> findByDifficulty(String difficulty, boolean includeAnswers) {
        return questionRepository.findByDifficultyIgnoreCase(difficulty).stream()
                .map(q -> toResponse(q, includeAnswers))
                .toList();
    }

    public QuestionResponse findById(String id, boolean includeAnswers) {
        return questionRepository.findById(id)
                .map(q -> toResponse(q, includeAnswers))
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + id));
    }

    public QuestionResponse create(QuestionRequest request) {
        Question question = fromRequest(request);
        return toResponse(questionRepository.save(question), true);
    }

    public QuestionResponse update(String id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + id));

        if (request.getSubject() != null)
            question.setSubject(request.getSubject());
        if (request.getDifficulty() != null)
            question.setDifficulty(request.getDifficulty());
        if (request.getType() != null)
            question.setType(request.getType());
        if (request.getQuestionText() != null)
            question.setQuestionText(request.getQuestionText());
        if (request.getOptions() != null)
            question.setOptions(request.getOptions());
        if (request.getCorrectAnswer() != null)
            question.setCorrectAnswer(request.getCorrectAnswer());
        if (request.getExplanation() != null)
            question.setExplanation(request.getExplanation());

        return toResponse(questionRepository.save(question), true);
    }

    public void delete(String id) {
        if (!questionRepository.existsById(id)) {
            throw new IllegalArgumentException("Question not found: " + id);
        }
        questionRepository.deleteById(id);
    }

    public QuestionResponse toResponse(Question q, boolean includeAnswers) {
        return new QuestionResponse(
                q.getId(),
                q.getSubject(),
                q.getDifficulty(),
                q.getType(),
                q.getQuestionText(),
                q.getOptions(),
                includeAnswers ? q.getCorrectAnswer() : null,
                includeAnswers ? q.getExplanation() : null);
    }

    private Question fromRequest(QuestionRequest request) {
        Question q = new Question();
        q.setSubject(request.getSubject());
        q.setDifficulty(request.getDifficulty());
        q.setType(request.getType());
        q.setQuestionText(request.getQuestionText());
        q.setOptions(request.getOptions());
        q.setCorrectAnswer(request.getCorrectAnswer());
        q.setExplanation(request.getExplanation());
        return q;
    }
}
