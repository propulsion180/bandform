package xyz.wmmp.bandform_backend.repositories;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.data.User;

import java.util.*;

import static java.util.stream.Collectors.toList;


public interface BandMemberRepository extends JpaRepository<BandMember, Long>{

}

//@Repository
//public class UserRepository {
//
//    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);
//    private final JdbcClient jdbcClient;
//
//    public UserRepository(JdbcClient jdbcClient){
//        this.jdbcClient = jdbcClient;
//    }
//
//    public List<User> findAll(){
//        Map<Integer, List<String>> instrumentMap = new HashMap<>();
//        Map<Integer, List<String>> genreMap = new HashMap<>();
//        Map<Integer, User> userMap = new LinkedHashMap<>();
//
//        jdbcClient.sql("""
//                SELECT u.id, u.name, u.city, u.country, u.description, i.instrument, g.genre
//                FROM Users u
//                LEFT JOIN UserInstruments i on u.id = i.user_id
//                LEFT JOIN UserGenres g on u.id = g.user_id
//                """)
//                .query(rs -> {
//                    do {
//                        int id = rs.getInt("id");
//                        userMap.putIfAbsent(id, new User(
//                                id, rs.getString("name"), rs.getString("city"), rs.getString("country"), rs.getString("description"), new ArrayList<>(), new ArrayList<>()
//                        ));
//                        String instrument = rs.getString("instrument");
//                        if (instrument != null && !instrumentMap.getOrDefault(id, Collections.emptyList()).contains(instrument)) {
//                             instrumentMap.computeIfAbsent(id, k -> new ArrayList<>()).add(instrument);
//                        }
//                        String genre = rs.getString("genre");
//                        if (genre != null && !genreMap.getOrDefault(id, Collections.emptyList()).contains(genre)) {
//                            genreMap.computeIfAbsent(id, k -> new ArrayList<>()).add(genre);
//                        }
//                    }while(rs.next());
//                });
//        return userMap.values().stream().map(u ->
//            new User(u.id(), u.name(), u.city(), u.country(), u.description(), genreMap.getOrDefault(u.id(), List.of()), instrumentMap.getOrDefault(u.id(), List.of()))
//        ).toList();
//    }
//
//    public Optional<User> findById(Integer id){
//        List<String> userInstruments = jdbcClient.sql("SELECT instrument FROM UserInstruments WHERE id = ?")
//                .param(id)
//                .query(String.class)
//                .list();
//
//        List<String> userGenres = jdbcClient.sql("SELECT genre FROM UserGenres WHERE id = ?")
//                .param(id)
//                .query(String.class)
//                .list();
//
//        return jdbcClient
//                .sql("SELECT * FROM Users WHERE id = ?")
//                .params(id)
//                .query((rs, rowNum) -> new User(
//                        rs.getInt("id"),
//                        rs.getString("name"),
//                        rs.getString("city"),
//                        rs.getString("country"),
//                        rs.getString("description"),
//                        userGenres,
//                        userInstruments
//                ))
//                .optional();
//    }
//
//    public void create(User user){
//        var created = jdbcClient.sql("INSERT INTO Users(id, name, city, country, description) values(?, ?, ?, ?, ?)")
//                .params(List.of(user.id(), user.name(), user.city(), user.country(), user.description()))
//                .update();
//        Assert.state(created == 1, "Failed to create user" + user.toString());
//        user.instruments().stream().forEach(i -> {
//            var createdInstruments = jdbcClient.sql("INSERT INTO UserInstruments(user_id, instrument) values(?, ?)")
//                    .params(List.of(user.id(), i))
//                    .update();
//
//            Assert.state(createdInstruments == 1, "Failed to add instruments" + user.instruments().toString());
//        });
//        user.genres().stream().forEach(g -> {
//            var createdGenres = jdbcClient.sql("INSERT INTO UserGenres(user_id, genre) values(?, ?)")
//                    .params(List.of(user.id(), g))
//                    .update();
//            Assert.state(createdGenres == 1, "Failed to add generes " + user.genres().toString());
//        });
//    }
//
//    public void update(User user, Integer id){
//        var update =  jdbcClient.sql("update Users set id = ?, name = ?, city = ?, country = ?, description = ? where id = ?")
//                .params(List.of(user.id(), user.name(), user.city(), user.country(), user.description(), id))
//                .update();
//        Assert.state(update == 1, "failed to update" + user.toString());
//        var deleted = jdbcClient.sql("delete from UserInstruments WHERE user_id = ?")
//                .param(id)
//                .update();
//        log.info("state of the delete before updating " + user.toString() + "'s instruments is " + deleted);
//        var deleted2 = jdbcClient.sql("delete from UserGenres WHERE user_id = ?")
//                .param(id)
//                .update();
//        log.info("state of the delete before updating " + user.toString() + "'s genres is " + deleted2);
//        user.instruments().forEach(i -> {
//            var created = jdbcClient.sql("insert into UserInstruments (user_id, instrument) values(?, ?)")
//                    .params(List.of(user.id(), i))
//                    .update();
//            Assert.state(created == 1, "Failed to add update instrument " + i + " for " + user.toString());
//        });
//        user.genres().forEach(g -> {
//            var created = jdbcClient.sql("insert into UserGenres (user_id, genre) values(?, ?)")
//                    .params(List.of(user.id(), g))
//                    .update();
//            Assert.state(created == 1, "Failed to add update genere " + g + " for " + user.toString());
//        });
//    }
//
//    public void delete(Integer id){
//        var deleted = jdbcClient.sql("delete from Users where id = ?")
//                .param(id)
//                .update();
//        log.info("deleted user id " + id + ", status is: " + deleted);
//    }
//
//    @PostConstruct
//    private void init(){
//        List<String> instruments1 = new ArrayList<>();
//        instruments1.add("Tabla");
//        instruments1.add("Drums");
//        List<String> genre1 = new ArrayList<>();
//        genre1.add("Indian Classical");
//        this.create(new User(1, "Dietz Nutz", "Denver", "United States of America", "Born in the USA", genre1, instruments1));
//        List<String> instruments2 = new ArrayList<>();
//        instruments2.add("Sitar");
//        instruments2.add("Guitar");
//        List<String> genre2 = new ArrayList<>();
//        genre2.add("Indian Classical Jazz Fusion");
//        this.create(new User(2, "ParleG", "Amritsar", "Bharat", "Tunak Tun Ta Ta Ta", genre2, instruments2));
//    }
//
//}
