package com.scientishunt.assessment.service;

import java.util.List;
import java.util.Optional;

import com.scientishunt.assessment.dto.SchoolRequest;
import com.scientishunt.assessment.dto.SchoolResponse;
import com.scientishunt.assessment.model.School;
import com.scientishunt.assessment.repository.SchoolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SchoolServiceTest {

    @Mock
    private SchoolRepository schoolRepository;

    @InjectMocks
    private SchoolService schoolService;

    private School school;

    @BeforeEach
    void setUp() {
        school = new School();
        school.setId("s1");
        school.setName("Alpha Academy");
        school.setPlan("PREMIUM");
        school.setStatus("ACTIVE");
    }

    @Test
    void findAll_returnsMappedResponses() {
        when(schoolRepository.findAll()).thenReturn(List.of(school));

        List<SchoolResponse> result = schoolService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Alpha Academy");
    }

    @Test
    void findById_existingId_returnsSchool() {
        when(schoolRepository.findById("s1")).thenReturn(Optional.of(school));

        SchoolResponse result = schoolService.findById("s1");

        assertThat(result.id()).isEqualTo("s1");
        assertThat(result.plan()).isEqualTo("PREMIUM");
    }

    @Test
    void findById_missingId_throws() {
        when(schoolRepository.findById("bad")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> schoolService.findById("bad"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("School not found");
    }

    @Test
    void create_setsDefaultActiveStatus() {
        SchoolRequest request = new SchoolRequest();
        request.setName("Beta High");
        request.setPlan("BASIC");

        School saved = new School();
        saved.setId("s2");
        saved.setName("Beta High");
        saved.setPlan("BASIC");
        saved.setStatus("ACTIVE");

        when(schoolRepository.save(any())).thenReturn(saved);

        SchoolResponse result = schoolService.create(request);

        assertThat(result.status()).isEqualTo("ACTIVE");
    }

    @Test
    void delete_existingId_invokesRepository() {
        when(schoolRepository.existsById("s1")).thenReturn(true);

        schoolService.delete("s1");

        verify(schoolRepository).deleteById("s1");
    }

    @Test
    void delete_missingId_throws() {
        when(schoolRepository.existsById("bad")).thenReturn(false);

        assertThatThrownBy(() -> schoolService.delete("bad"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
