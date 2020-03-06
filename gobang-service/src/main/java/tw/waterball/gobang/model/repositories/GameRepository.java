package tw.waterball.gobang.model.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tw.waterball.gobang.model.Game;

@Repository
public interface GameRepository extends CrudRepository<Game, Integer> {
}
