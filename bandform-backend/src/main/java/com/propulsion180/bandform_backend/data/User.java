package com.propulsion180.bandform_backend.data;

import java.util.ArrayList;

import jakarta.annotation.Generated;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String firstName;
	private String lastName;
	private String city;
	private String country;
	private String description;

	@ElementCollection
	private ArrayList<String> instruments;

	public User() {
	}

	public User(String fName, String lName, String ct, String cy, String desc, ArrayList<String> inst) {

		if (fName.isEmpty()) {
			firstName = "";
		} else {
			firstName = fName;
		}
		if (lName.isEmpty()) {
			lastName = "";
		} else {
			lastName = lName;
		}
		if (ct.isEmpty()) {
			city = "";
		} else {
			city = ct;
		}
		if (cy.isEmpty()) {
			country = "";
		} else {
			country = cy;
		}
		if (desc.isEmpty()) {
			description = "";
		} else {
			description = desc;
		}

		if (inst.isEmpty()) {
			instruments = new ArrayList<>();
		} else {
			instruments = new ArrayList<>(inst);
		}

	}

	public Long getId() {
		return id;
	}

	public void setId(Long nid) {
		id = nid;
	}

	public String getFName() {
		return firstName;
	}

	public String getLName() {
		return lastName;
	}

	public void setFName(String fn) {
		firstName = fn;
	}

	public void setLName(String ln) {
		lastName = ln;
	}

	public String getLoc() {
		return city + ", " + country;
	}

	public String getDescription() {
		return description;
	}

	public ArrayList<String> getInstruments() {
		return instruments;
	}

	public String getInstrumentsString() {
		String toRet = "";
		for (String inst : instruments) {
			toRet = toRet + ", " + inst;
		}

		return toRet;
	}

	public Boolean containsInstrument(String ci) {
		for (String inst : instruments) {
			if (inst.equals(ci)) {
				return true;
			}
		}

		return false;
	}

	public void addIinstrument(String i) {
		instruments.add(i);
	}

}
