package com.scientishunt.assessment.service;

import java.util.List;

import com.scientishunt.assessment.dto.ExamRequest;
import com.scientishunt.assessment.dto.ExamResponse;
import com.scientishunt.assessment.dto.ExamSummary;
import com.scientishunt.assessment.model.Exam;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.repository.ExamRepository;
import com.scientishunt.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final QuestionService questionService;

    public ExamService(
            ExamRepository examRepository,
            QuestionRepository questionRepository,
            QuestionService questionService) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.questionService = questionService;
    }

    public List<ExamSummary> findAllSummaries() {
        return examRepository.findAll().stream().map(this::toSummary).toList();
    }

    public ExamResponse findById(String id, boolean includeAnswers) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + id));
        return toResponse(exam, includeAnswers);
    }

    public ExamSummary create(ExamRequest request) {
        validateQuestionIds(request.getQuestionIds());

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setDuration(request.getDuration());
        exam.setTotalMarks(request.getTotalMarks());
        exam.setQuestionIds(request.getQuestionIds());
        return toSummary(examRepository.save(exam));
    }

    public ExamSummary update(String id, ExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + id));

        if (request.getTitle() != null)
            exam.setTitle(request.getTitle());
        if (request.getDuration() > 0)
            exam.setDuration(request.getDuration());
        if (request.getTotalMarks() > 0)
            exam.setTotalMarks(request.getTotalMarks());
        if (request.getQuestionIds() != null && !request.getQuestionIds().isEmpty()) {
            validateQuestionIds(request.getQuestionIds());
            exam.setQuestionIds(request.getQuestionIds());
        }

        return toSummary(examRepository.save(exam));
    }

    public void delete(String id) {
        if (!examRepository.existsById(id)) {
            throw new IllegalArgumentException("Exam not found: " + id);
        }
        examRepository.deleteById(id);
    }

    public List<Question> loadQuestionsForExam(String examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId));
        return questionRepository.findAllById(exam.getQuestionIds());
    }

    private void validateQuestionIds(List<String> ids) {
        long found = questionRepository.countByIdIn(ids);
        if (found != ids.size()) {
            throw new IllegalArgumentException("One or more question IDs are invalid");
        }
    }

    private ExamSummary toSummary(Exam exam) {
        int count = exam.getQuestionIds() == null ? 0 : exam.getQuestionIds().size();
        return new ExamSummary(exam.getId(), exam.getTitle(), exam.getDuration(), exam.getTotalMarks(), count);
    }

    private ExamResponse toResponse(Exam exam, boolean includeAnswers) {
        List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());
        List<com.scientishunt.assessment.dto.QuestionResponse> qResponses = questions.stream()
                .map(q -> questionService.toResponse(q, includeAnswers))
                .toList();
        return new ExamResponse(exam.getId(), exam.getTitle(), exam.getDuration(), exam.getTotalMarks(), qResponses);
    }
}
