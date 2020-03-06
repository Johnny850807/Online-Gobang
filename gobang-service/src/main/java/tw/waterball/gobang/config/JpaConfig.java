package tw.waterball.gobang.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import tw.waterball.gobang.model.repositories.GameRepository;

@Configuration
@EnableJpaRepositories(basePackageClasses = GameRepository.class)
public class JpaConfig {
}
