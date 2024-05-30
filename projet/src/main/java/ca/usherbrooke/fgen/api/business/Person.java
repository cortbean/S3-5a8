package ca.usherbrooke.fgen.api.business;

import java.util.List;

public class Person {
    public String cip;
    public String lastName;
    public String firstName;
    public String email;
    public String role;

    /*public String getCip() {
        return cip;
    }
    public void setCip(String cip) {
        this.cip = cip;
    }
    public String getLast_name() {
        return last_name;
    }
    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
    public String getFirst_name() {
        return first_name;
    }
    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }*/

    @Override
    public String toString() {
        return "Person{cip='" + cip + "', last_name='" + lastName + "', first_name='" + firstName + "', email='" + email + "}";
    }
}
