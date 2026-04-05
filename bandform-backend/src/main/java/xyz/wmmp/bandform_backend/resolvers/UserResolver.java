package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;

@Controller
public class UserResolver{
    private final UserService userService;

    @Autowired
    public UserResolver(UserService userService){
        this.userService = userService;
    }

    @QueryMapping
    public List<User> users(){
        return userService.getAllUsers();
    }

    @QueryMapping
    public User user(@Argument Long id){
        return userService.getUserById(id);
    }


    @MutationMapping
    public User createUser(
            @Argument String name,
            @Argument String city,
            @Argument String country,
            @Argument String description,
            @Argument List<String> genres,
            @Argument List<String> instruments
    ){
        return userService.createUser(name, city, country, description, genres, instruments);
    }
}