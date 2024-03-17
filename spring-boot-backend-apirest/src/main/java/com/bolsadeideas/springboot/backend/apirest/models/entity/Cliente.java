package com.bolsadeideas.springboot.backend.apirest.models.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "clientes")
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long id;

    @NotEmpty(message = "No puede estar vacio")
    @Size(min=4, max=12, message = "El tamaño tiene que ser entre 4 a 12 caracteres")
    @Column(nullable=false)
    public String nombre;

    @NotEmpty(message = "No puede estar vacio")
    public String apellido;

    @NotEmpty(message = "No puede estar vacio")
    @Email(message = "Debe ingresar un formato correcto")
    @Column(nullable=false, unique=false)
    public String email;

    @NotNull(message = "No puede estar vacio")
    @Column(name="create_at")
    @Temporal(TemporalType.DATE)
    public Date createAt;

    public String foto;

    //ya no se usara porque se manejara desde el formulario
    //@PrePersist
    //public void prePersist() {
    //    createAt = new Date();
    //}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

}
