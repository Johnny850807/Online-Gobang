package tw.waterball.gobang.model.repositories;

import org.springframework.data.repository.CrudRepository;
import tw.waterball.gobang.model.Game;

public interface GameRepository extends CrudRepository<Game, Integer> {
}
