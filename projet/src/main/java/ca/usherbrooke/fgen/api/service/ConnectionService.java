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
        p.last_name = (String)this.jwt.getClaim("family_name");
        p.first_name = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        /*Map realmAccess = (Map)this.jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            p.roles = (List)realmAccess.get("roles");
        }*/
        // Debug logging
        System.out.println("Person object before insertion: " + p);

        personMapper.insertPerson(p);
        System.out.println("Inserted person into database");

        return p;
    }

    @GET
    @Path("/admin")
    @RolesAllowed({"admin"})
    public Person admin() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.last_name = (String)this.jwt.getClaim("family_name");
        p.first_name = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        /*Map realmAccess = (Map)this.jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            p.roles = (List)realmAccess.get("roles");
        }*/
        personMapper.insertPerson(p);
        System.out.println(p);

        return p;
    }

    @GET
    @Path("/categorie")
    @PermitAll
    public List<Item> Categorie() {
        List<Item> cat = categorieMapper.allCategorie();
        return cat;
    }

    @GET
    @Path("/any")
    @PermitAll
    public Person me() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.last_name = (String)this.jwt.getClaim("family_name");
        p.first_name = (String)this.jwt.getClaim("given_name");
        p.email = (String)this.jwt.getClaim("email");
        /*Map realmAccess = (Map)this.jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            p.roles = (List)realmAccess.get("roles");
        }*/

        // Debug logging
        System.out.println("Person object before insertion: " + p);

        personMapper.insertPerson(p);
        System.out.println("Inserted person into database");

        return p;
    }



    @GET
    @Path("/test")
    public String test() {
        return "ok";
    }
}

