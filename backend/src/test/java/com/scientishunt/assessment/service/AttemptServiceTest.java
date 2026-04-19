package com.scientishunt.assessment.service;

import java.util.List;
import java.util.Optional;

import com.scientishunt.assessment.dto.AttemptRequest;
import com.scientishunt.assessment.dto.AttemptResponse;
import com.scientishunt.assessment.model.Attempt;
import com.scientishunt.assessment.model.Exam;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import com.scientishunt.assessment.repository.AttemptRepository;
import com.scientishunt.assessment.repository.ExamRepository;
import com.scientishunt.assessment.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttemptServiceTest {

    @Mock
    private AttemptRepository attemptRepository;
    @Mock
    private ExamRepository examRepository;
    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private AttemptService attemptService;

    private Exam exam;
    private Question mcqQuestion;
    private Question descQuestion;

    @BeforeEach
    void setUp() {
        exam = new Exam();
        exam.setId("exam1");
        exam.setTitle("Science Final");
        exam.setDuration(60);
        exam.setTotalMarks(100);
        exam.setQuestionIds(List.of("q1", "q2"));

        mcqQuestion = new Question();
        mcqQuestion.setId("q1");
        mcqQuestion.setType(QuestionType.MCQ);
        mcqQuestion.setCorrectAnswer("A");

        descQuestion = new Question();
        descQuestion.setId("q2");
        descQuestion.setType(QuestionType.DESC);
        descQuestion.setCorrectAnswer(null);
    }

    @Test
    void submit_autoGradesMcqOnly_skipsDesc() {
        Map<String, String> answers = Map.of("q1", "A", "q2", "Some essay");

        when(attemptRepository.existsByExamIdAndUserId("exam1", "user1")).thenReturn(false);
        when(examRepository.findById("exam1")).thenReturn(Optional.of(exam));
        when(questionRepository.findAllById(List.of("q1", "q2"))).thenReturn(List.of(mcqQuestion, descQuestion));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            Attempt a = inv.getArgument(0);
            a.setId("att1");
            return a;
        });

        AttemptRequest request = new AttemptRequest();
        request.setExamId("exam1");
        request.setAnswers(answers);

        AttemptResponse result = attemptService.submit(request, "user1");

        // 1 gradeable (MCQ), 1 correct → score = 100.0
        assertThat(result.score()).isEqualTo(100.0);
    }

    @Test
    void submit_wrongAnswer_scoresZero() {
        Map<String, String> answers = Map.of("q1", "B", "q2", "essay");

        when(attemptRepository.existsByExamIdAndUserId("exam1", "user1")).thenReturn(false);
        when(examRepository.findById("exam1")).thenReturn(Optional.of(exam));
        when(questionRepository.findAllById(List.of("q1", "q2"))).thenReturn(List.of(mcqQuestion, descQuestion));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            Attempt a = inv.getArgument(0);
            a.setId("att2");
            return a;
        });

        AttemptRequest request = new AttemptRequest();
        request.setExamId("exam1");
        request.setAnswers(answers);

        AttemptResponse result = attemptService.submit(request, "user1");

        assertThat(result.score()).isEqualTo(0.0);
    }

    @Test
    void submit_duplicateAttempt_throws() {
        when(attemptRepository.existsByExamIdAndUserId("exam1", "user1")).thenReturn(true);

        AttemptRequest request = new AttemptRequest();
        request.setExamId("exam1");
        request.setAnswers(Map.of());

        assertThatThrownBy(() -> attemptService.submit(request, "user1"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already attempted");
    }

    @Test
    void submit_examNotFound_throws() {
        when(attemptRepository.existsByExamIdAndUserId("bad", "user1")).thenReturn(false);
        when(examRepository.findById("bad")).thenReturn(Optional.empty());

        AttemptRequest request = new AttemptRequest();
        request.setExamId("bad");
        request.setAnswers(Map.of());

        assertThatThrownBy(() -> attemptService.submit(request, "user1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Exam not found");
    }

    @Test
    void findByExam_delegatesToRepository() {
        when(attemptRepository.findByExamId("exam1")).thenReturn(List.of());
        assertThat(attemptService.findByExam("exam1")).isEmpty();
    }
}
