package ca.usherbrooke.fgen.api.business;

import java.util.List;

public class Person {
    public String cip;
    public String lastName;
    public String firstName;
    public String email;
    public String role;

    @Override
    public String toString() {
        return "Person{cip='" + cip + "', last_name='" + lastName + "', first_name='" + firstName + "', email='" + email + "}";
    }
}
