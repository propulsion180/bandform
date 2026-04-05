package xyz.wmmp.bandform_backend.repositories;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.exceptions.UserNotFoundException;

import java.util.*;

public interface BandRepository extends JpaRepository<Band, Long> {

}
//
//@Repository
//public class BandRepository {
//
//    private static final Logger log = LoggerFactory.getLogger(BandRepository.class);
//    private final JdbcClient jdbcClient;
//    private final UserRepository userRepository;
//
//    public BandRepository(JdbcClient jdbcClient, UserRepository userRepository){
//        this.jdbcClient = jdbcClient;
//        this.userRepository = userRepository;
//    }
//
//    public List<Band> findAll() {
//        Map<Integer, List<User>> MemberMap = new HashMap<>();
//        Map<Integer, List<Integer>> MemberIdMap = new HashMap<>();
//        Map<Integer, List<String>> GenreMap = new HashMap<>();
//        Map<Integer, Band> bandMap = new LinkedHashMap<>();
//
//
//        jdbcClient.sql("""
//                        select b.id, b.name, m.user_id, g.genre
//                        From Bands b
//                        LEFT JOIN BandMembers m on b.id = m.band_id
//                        LEFT JOIN BandGenres g on b.id = g.band_id
//                        """)
//                .query(rs -> {
//                    do {
//                        int id = rs.getInt("id");
//                        bandMap.putIfAbsent(id, new Band(id, rs.getString("name"), new ArrayList<>(), new ArrayList<>()));
//                        Integer memberId = rs.getInt("user_id");
//                        if (memberId != null && !MemberIdMap.getOrDefault(id, Collections.emptyList()).contains(memberId)) {
//                            MemberIdMap.computeIfAbsent(id, k -> new ArrayList<>()).add(memberId);
//                        }
//                        String genre = rs.getString("genre");
//                        if (genre != null && !GenreMap.getOrDefault(id, Collections.emptyList()).contains(genre)) {
//                            GenreMap.computeIfAbsent(id, k -> new ArrayList<>()).add(genre);
//                        }
//
//                    } while (rs.next());
//                });
//
//        return bandMap.values().stream().map(b -> {
//            List<User> members = MemberIdMap.getOrDefault(b.id(), List.of()).stream().map(mId -> {
//                Optional<User> tempUser = userRepository.findById(mId);
//                if(tempUser.isEmpty()){
//                    throw new UserNotFoundException();
//                }
//
//                return tempUser.get();
//            }).toList();
//            return new Band(b.id(), b.name(), GenreMap.getOrDefault(b.id(), List.of()), members);
//        }).toList();
//    }
//    public Optional<Band> findById(Integer id){
//        List<String> genres = jdbcClient.sql("select genres from BandGenres where band_id = ?")
//                .param(id)
//                .query(String.class)
//                .list();
//        List<Integer> memberIds = jdbcClient.sql("select user_id from BandMembers where band_id = ?")
//                .param(id)
//                .query(Integer.class)
//                .list();
//        List<User> members = memberIds.stream().map(m -> {
//            Optional<User> opuser = userRepository.findById(m);
//            if(opuser.isEmpty()){
//                throw new UserNotFoundException();
//            }
//
//            return opuser.get();
//        }).toList();
//
//        return jdbcClient.sql("select * from Bands where id = ?")
//                .params(id)
//                .query((rs, rowNum) -> new Band(
//                        rs.getInt("id"),
//                        rs.getString("name"),
//                        genres,
//                        members
//                ))
//                .optional();
//    }
//
//    public void create(Band band){
//        var createdUser = jdbcClient.sql("insert into Bands(id, name) values(?, ?)")
//                .params(List.of(band.id(), band.name()))
//                .update();
//        Assert.state(createdUser == 1, "Failed to insert user " + band.toString());
//
//        band.bandGenres().forEach(g -> {
//            var createdGenres = jdbcClient.sql("insert into BandGenres(band_id, genere) values(?, ?)")
//                    .params(List.of(band.id(), g))
//                    .update();
//            Assert.state(createdGenres == 1, "Failed to add genere " + g + " for band: " + band.toString());
//        });
//
//        band.bandMembers().forEach(m -> {
//            var createdMembers = jdbcClient.sql("insert into BandMembers(band_id, user_id) values(?, ?)")
//                    .params(List.of(band.id(), m.id()))
//                    .update();
//            Assert.state(createdMembers == 1, "Failed to add genere " + m + " for band: " + band.toString());
//        });
//    }
//
//    public void update(Band band, Integer id){
//        var updatedBand = jdbcClient.sql("update Bands set id = ?, name = ? where id = ?")
//                .params(List.of(band.id(), band.name(), id))
//                .update();
//        Assert.state(updatedBand == 1, "Failed to update bandr " + id + " with band: " + band);
//
//        var removeGenres = jdbcClient.sql("delete * from BandGenres where band_id = ?")
//                .param(id)
//                .update();
//        Assert.state(removeGenres == 1, "Failed to remove genres during update");
//
//        var removeMembers = jdbcClient.sql("delete * from BandMembers where band_id = ?")
//                .param(id)
//                .update();
//        Assert.state(removeMembers == 1, "Failed to remove members during update");
//
//        band.bandGenres().forEach(g -> {
//            var createdGenres = jdbcClient.sql("insert into BandGenres(band_id, genere) values(?, ?)")
//                    .params(List.of(band.id(), g))
//                    .update();
//            Assert.state(createdGenres == 1, "Failed to add genere " + g + " for band: " + band.toString());
//        });
//
//        band.bandMembers().forEach(m -> {
//            var createdMembers = jdbcClient.sql("insert into BandMembers(band_id, user_id) values(?, ?)")
//                    .params(List.of(band.id(), m.id()))
//                    .update();
//            Assert.state(createdMembers == 1, "Failed to add genere " + m + " for band: " + band.toString());
//        });
//    }
//
//    public void removeById(Integer id){
//        var removed = jdbcClient.sql("delete * from Bands where id = ?")
//                .param(id)
//                .update();
//        Assert.state(removed == 1, "Failed to delete band with id: " + id);
//    }
//}
