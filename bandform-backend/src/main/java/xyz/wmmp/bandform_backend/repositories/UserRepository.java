package xyz.wmmp.bandform_backend.repositories;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;
import xyz.wmmp.bandform_backend.data.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private List<User> users = new ArrayList<>();

    public List<User> findAll(){
        return users;
    }

    public Optional<User> findById(Integer id){
        return users.stream()
                .filter(run -> run.id() == id)
                .findFirst();
    }

    public void create(User user){
        users.add(user);
    }

    public void update(User user, Integer id){
        Optional<User> existing = findById(id);
        if(existing.isPresent()){
            users.set(users.indexOf(existing.get()), user);
        }
    }

    public void delete(Integer id){
        users.removeIf(run -> run.id().equals(id));
    }

    @PostConstruct
    private void init(){
        List<String> instruments1 = new ArrayList<>();
        instruments1.add("Tabla");
        instruments1.add("Drums");
        users.add(new User(1, "Dietz Nutz", "Denver", "United States of America", "Born in the USA", instruments1));
        List<String> instruments2 = new ArrayList<>();
        instruments2.add("Sitar");
        instruments2.add("Guitar");
        users.add(new User(2, "ParleG", "Amritsar", "Bharat", "Tunak Tun Ta Ta Ta", instruments2));
    }

}
