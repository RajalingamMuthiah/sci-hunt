package com.scientishunt.assessment.service;

import java.util.List;
import java.util.Map;

import com.scientishunt.assessment.dto.AttemptRequest;
import com.scientishunt.assessment.dto.AttemptResponse;
import com.scientishunt.assessment.model.Attempt;
import com.scientishunt.assessment.model.Exam;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import com.scientishunt.assessment.repository.AttemptRepository;
import com.scientishunt.assessment.repository.ExamRepository;
import com.scientishunt.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public AttemptService(
            AttemptRepository attemptRepository,
            ExamRepository examRepository,
            QuestionRepository questionRepository) {
        this.attemptRepository = attemptRepository;
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
    }

    public AttemptResponse submit(AttemptRequest request, String userId) {
        if (attemptRepository.existsByExamIdAndUserId(request.getExamId(), userId)) {
            throw new IllegalStateException("Exam already attempted");
        }

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + request.getExamId()));

        List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());

        double score = autoGrade(questions, request.getAnswers(), exam.getTotalMarks());

        Attempt attempt = new Attempt();
        attempt.setExamId(request.getExamId());
        attempt.setUserId(userId);
        attempt.setAnswers(request.getAnswers());
        attempt.setScore(score);

        return toResponse(attemptRepository.save(attempt));
    }

    public AttemptResponse findById(String id) {
        return attemptRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + id));
    }

    public List<AttemptResponse> findByExam(String examId) {
        return attemptRepository.findByExamId(examId).stream().map(this::toResponse).toList();
    }

    public List<AttemptResponse> findByUser(String userId) {
        return attemptRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public AttemptResponse findByExamAndUser(String examId, String userId) {
        return attemptRepository.findByExamIdAndUserId(examId, userId)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found"));
    }

    public List<AttemptResponse> getPendingGrading() {
        List<Attempt> all = attemptRepository.findAll();
        return all.stream()
                .filter(attempt -> {
                    Exam exam = examRepository.findById(attempt.getExamId()).orElse(null);
                    if (exam == null) return false;
                    List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());
                    return questions.stream().anyMatch(q -> q.getType() == QuestionType.DESCRIPTIVE);
                })
                .map(this::toResponse)
                .toList();
    }

    public AttemptResponse gradeDescriptive(String attemptId, List<Map<String, Object>> grades) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + attemptId));

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found"));
        List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());

        double descriptiveScore = 0;
        for (Map<String, Object> grade : grades) {
            String questionId = (String) grade.get("questionId");
            Number scoreNum = (Number) grade.get("score");
            if (questionId != null && scoreNum != null) {
                Question q = questions.stream()
                        .filter(qs -> qs.getId().equals(questionId))
                        .findFirst().orElse(null);
                if (q != null && q.getType() == QuestionType.DESCRIPTIVE) {
                    double maxMark = q.getMarks() != null ? q.getMarks() : 0;
                    descriptiveScore += Math.min(scoreNum.doubleValue(), maxMark);
                }
            }
        }

        double mcqScore = autoGrade(questions, attempt.getAnswers(), exam.getTotalMarks());
        attempt.setScore(Math.round((mcqScore + descriptiveScore) * 100.0) / 100.0);
        return toResponse(attemptRepository.save(attempt));
    }

    public AttemptResponse syncDraft(String examId, String userId, Map<String, String> answers) {
        Attempt attempt = attemptRepository.findByExamIdAndUserId(examId, userId).orElse(null);
        if (attempt == null) {
            attempt = new Attempt();
            attempt.setExamId(examId);
            attempt.setUserId(userId);
            attempt.setScore(0);
        }
        attempt.setAnswers(answers);
        return toResponse(attemptRepository.save(attempt));
    }

    private double autoGrade(List<Question> questions, Map<String, String> answers, int totalMarks) {
        int gradeable = 0;
        int correct = 0;

        for (Question question : questions) {
            if (question.getType() == QuestionType.DESCRIPTIVE) {
                continue;
            }
            gradeable++;

            String submitted = answers == null ? null : answers.get(question.getId());
            if (submitted == null) continue;

            if (question.getType() == QuestionType.TRUE_FALSE) {
                if (question.getCorrectBoolAnswer() != null) {
                    boolean answer = Boolean.parseBoolean(submitted.trim());
                    if (answer == question.getCorrectBoolAnswer()) {
                        correct++;
                    }
                }
            } else if (question.getType() == QuestionType.MCQ) {
                if (question.getOptions() != null) {
                    boolean isCorrect = question.getOptions().stream()
                            .anyMatch(opt -> opt.getId().equals(submitted.trim()) && opt.isCorrect());
                    if (isCorrect) {
                        correct++;
                    }
                } else if (question.getCorrectAnswer() != null
                        && question.getCorrectAnswer().equalsIgnoreCase(submitted.trim())) {
                    correct++;
                }
            }
        }

        if (gradeable == 0) {
            return 0.0;
        }

        return Math.round(((double) correct / gradeable) * totalMarks * 100.0) / 100.0;
    }

    private AttemptResponse toResponse(Attempt attempt) {
        return new AttemptResponse(
                attempt.getId(),
                attempt.getExamId(),
                attempt.getUserId(),
                attempt.getAnswers(),
                attempt.getScore(),
                attempt.getCreatedAt());
    }
}
