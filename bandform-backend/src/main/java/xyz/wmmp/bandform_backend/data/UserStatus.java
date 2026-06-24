package xyz.wmmp.bandform_backend.data;

public enum UserStatus {
    NOBANDRAND, //Not in band and willing to be selected in random matching
    NOBANDSEL, //Not in band only willing to choose or be chosen.
    BAND, //In band, don't want to be matched again
    BANDRAND, //In band, willing to join another random band
    BANDSEL, //In band, willing to jin anohter band that is seleced.
}
