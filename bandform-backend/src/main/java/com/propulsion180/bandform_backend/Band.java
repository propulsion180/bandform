package com.propulsion180.bandform_backend;

import java.util.ArrayList;
import java.util.HashMap;

public class Band {
	private HashMap<String, User> bandInstruments;
	private String bandName;
	private String genre;
	private String location;

	public Band(String name, String gen) {
		bandName = name;
		genre = gen;
	}

	public Band(String name, String gen, HashMap<String, User> bi) {
		bandName = name;
		genre = gen;
		bandInstruments = bi;
	}

	public boolean hasNoInstruments() {
		return bandInstruments.isEmpty();
	}

	public void addInstrument(String instrument, User player) {
		bandInstruments.put(instrument, player);
	}

	public void removeInstrument(String insrument) {
		bandInstruments.remove(insrument);
	}

	public ArrayList<String> stillNeeds() {
		ArrayList<String> unfullfilled = new ArrayList<>();
		for (String k : bandInstruments.keySet()) {
			if (bandInstruments.get(k) == null) {
				unfullfilled.add(k);
			}
		}

		return unfullfilled;
	}

	public String getGenre() {
		return genre;
	}

	public String getName() {
		return bandName;
	}

	public String getLocation() {
		return location;
	}

	public void setName(String name) {
		bandName = name;
	}

	public void setGenre(String gen) {
		genre = gen;
	}

	public void setLocation(String loc) {
		location = loc;
	}

}
