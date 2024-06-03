package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Item;
import ca.usherbrooke.fgen.api.business.Message;
import ca.usherbrooke.fgen.api.business.Person;
import ca.usherbrooke.fgen.api.mapper.CategorieMapper;
import ca.usherbrooke.fgen.api.mapper.MessageMapper;
import ca.usherbrooke.fgen.api.mapper.PersonMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.Map;

@Path("/api")
@Produces({"application/json"})
public class ConnectionService {
    @Context
    SecurityContext securityContext;

    @Inject
    JsonWebToken jwt;

    @Inject
    PersonMapper personMapper;

    @Inject
    CategorieMapper categorieMapper;


    @GET
    @Path("/client")
    @RolesAllowed({"client"})
    public Person client() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String)this.jwt.getClaim("family_name");
        p.firstName = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        p.role = "client";
        personMapper.insertPerson(p);
        return p;
    }

    @GET
    @Path("/admin")
    @RolesAllowed({"admin"})
    public Person admin() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String)this.jwt.getClaim("family_name");
        p.firstName = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        p.role = "admin";
        personMapper.insertPerson(p);

        return p;
    }

    @GET
    @Path("/getcategorie")
    @PermitAll
    public List<Item> getCategorie() {
        List<Item> item = categorieMapper.allCategorie();
        return item;
    }

    @GET
    @Path("/any")
    @PermitAll
    public Person me() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String)this.jwt.getClaim("family_name");
        p.firstName = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        personMapper.insertPerson(p);
        return p;
    }



    @GET
    @Path("/test")
    public String test() {
        return "ok";
    }
}

