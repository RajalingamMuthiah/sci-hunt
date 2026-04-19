package com.scientishunt.assessment.service;

import java.util.List;
import java.util.Optional;

import com.scientishunt.assessment.dto.ExamRequest;
import com.scientishunt.assessment.dto.ExamResponse;
import com.scientishunt.assessment.dto.ExamSummary;
import com.scientishunt.assessment.model.Exam;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
import com.scientishunt.assessment.repository.ExamRepository;
import com.scientishunt.assessment.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;
    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private QuestionService questionService;

    @InjectMocks
    private ExamService examService;

    private Exam exam;
    private Question question;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setId("q1");
        question.setType(QuestionType.MCQ);
        question.setQuestionText("Sample?");

        exam = new Exam();
        exam.setId("e1");
        exam.setTitle("Final");
        exam.setDuration(90);
        exam.setTotalMarks(50);
        exam.setQuestionIds(List.of("q1"));
    }

    @Test
    void create_validQuestions_returnsSummary() {
        when(questionRepository.countByIdIn(anyCollection())).thenReturn(1L);
        when(examRepository.save(any())).thenAnswer(inv -> {
            Exam e = inv.getArgument(0);
            e.setId("e1");
            return e;
        });

        ExamRequest request = new ExamRequest();
        request.setTitle("Final");
        request.setDuration(90);
        request.setTotalMarks(50);
        request.setQuestionIds(List.of("q1"));

        ExamSummary result = examService.create(request);

        assertThat(result.title()).isEqualTo("Final");
        assertThat(result.questionCount()).isEqualTo(1);
    }

    @Test
    void create_invalidQuestionId_throws() {
        when(questionRepository.countByIdIn(anyCollection())).thenReturn(0L);

        ExamRequest request = new ExamRequest();
        request.setTitle("Bad Exam");
        request.setDuration(30);
        request.setTotalMarks(10);
        request.setQuestionIds(List.of("bad_id"));

        assertThatThrownBy(() -> examService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("question IDs are invalid");
    }

    @Test
    void findById_populatesQuestions_includeAnswersTrue() {
        when(examRepository.findById("e1")).thenReturn(Optional.of(exam));
        when(questionRepository.findAllById(List.of("q1"))).thenReturn(List.of(question));
        when(questionService.toResponse(any(), any(Boolean.class))).thenCallRealMethod();

        question.setCorrectAnswer("A");

        ExamResponse response = examService.findById("e1", true);

        assertThat(response.questions()).hasSize(1);
    }

    @Test
    void findById_notFound_throws() {
        when(examRepository.findById("bad")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> examService.findById("bad", false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Exam not found");
    }
}
