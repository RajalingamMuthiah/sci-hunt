package com.scientishunt.assessment.service;

import java.util.List;
import java.util.Optional;

import com.scientishunt.assessment.dto.QuestionRequest;
import com.scientishunt.assessment.dto.QuestionResponse;
import com.scientishunt.assessment.model.Question;
import com.scientishunt.assessment.model.QuestionType;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionService questionService;

    private Question question;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setId("q1");
        question.setSubject("Physics");
        question.setDifficulty("MEDIUM");
        question.setType(QuestionType.MCQ);
        question.setQuestionText("What is Newton's first law?");
        question.setOptions(List.of(
            new Question.Option("a", "A", null, true),
            new Question.Option("b", "B", null, false),
            new Question.Option("c", "C", null, false),
            new Question.Option("d", "D", null, false)
        ));
        question.setCorrectAnswer("A");
        question.setExplanation("Law of inertia");
    }

    @Test
    void findAll_includeAnswers_returnsCorrectAnswer() {
        when(questionRepository.findAll()).thenReturn(List.of(question));

        List<QuestionResponse> result = questionService.findAll(true);

        assertThat(result.get(0).correctAnswer()).isEqualTo("A");
        assertThat(result.get(0).explanation()).isEqualTo("Law of inertia");
    }

    @Test
    void findAll_excludeAnswers_hiddenCorrectAnswer() {
        when(questionRepository.findAll()).thenReturn(List.of(question));

        List<QuestionResponse> result = questionService.findAll(false);

        assertThat(result.get(0).correctAnswer()).isNull();
        assertThat(result.get(0).explanation()).isNull();
    }

    @Test
    void findBySubject_filtersBySubject() {
        when(questionRepository.findBySubjectIgnoreCase("Physics")).thenReturn(List.of(question));

        List<QuestionResponse> result = questionService.findBySubject("Physics", false);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).subject()).isEqualTo("Physics");
    }

    @Test
    void findById_missing_throws() {
        when(questionRepository.findById("bad")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> questionService.findById("bad", true))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Question not found");
    }

    @Test
    void create_persistsAndReturnsWithAnswers() {
        QuestionRequest request = new QuestionRequest();
        request.setSubject("Chemistry");
        request.setDifficulty("EASY");
        request.setType(QuestionType.TRUE_FALSE);
        request.setQuestionText("Water is H2O?");
        request.setCorrectAnswer("TRUE");

        when(questionRepository.save(any())).thenAnswer(inv -> {
            Question q = inv.getArgument(0);
            q.setId("q2");
            return q;
        });

        QuestionResponse result = questionService.create(request);

        assertThat(result.correctAnswer()).isEqualTo("TRUE");
        assertThat(result.subject()).isEqualTo("Chemistry");
    }
}
