const Song = require('../models/song')
const User = require('../models/user')
const Support = require('../models/support')
const Playlist = require('../models/playlist')

const functions = {
    
    upload_song: function (req, res) {
        if(!req.body.song_name || !req.body.song_url || !req.body.song_picture_url || !req.body.genre_name || !req.body.artist_id || !req.body.artist_name || !req.body.song_description) {
            res.status(404).send({
                success: false,
                msg: "All fields are required!!"
            })
        } else {
            Song.findOne({
                song_name: req.body.song_name,
                artist_id: req.body.artist_id,
            }, function(err, song){
                if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Error in uploading song!!"
                    })  
                } else if(song) {
                    res.status(404).send({
                        success: false,
                        msg: "Song already exists!!"
                    })
                } else {
                    var newSong = Song({
                        song_name: req.body.song_name,
                        song_url: req.body.song_url,
                        song_picture_url: req.body.song_picture_url,
                        genre_name: req.body.genre_name,
                        artist_id: req.body.artist_id,
                        artist_name: req.body.artist_name,
                        album_id: req.body.album_id,
                        album_name: req.body.album_name,
                        song_description: req.body.song_description,
                        song_lyrics: req.body.song_lyrics
                    })
                    newSong.save(async function (err, newSong) {
                        if(err) {
                            res.status(404).send({
                                success: false,
                                msg: "Error in uploading song!!",
                                err: err
                            })
                        } else {
                            res.status(200).send({
                                success: true,
                                msg: "Successfully uploaded the song.",
                                song: newSong
                            })
                        }
                    })
                }
            })
        
        }
    },

    get_song_detail: async function(req, res) {
        try {
            const song = await Song.findById(req.params.id, function(err, song){
                if(song) {
                    res.status(200).send({
                        success: true,
                        song: song
                    })
                } else if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to retrive Song details!!",
                        err: err
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "Song does not exists!!",
                    })
                }
            })
        } catch(err) {
            res.status(404).send({
                success: false,
                msg: "Failed to retrive Song details!!",
                err: err
            })
        }
    },

    browse_songs: function(req, res) {
        try{
            Song.findRandom({}, {}, {limit: Infinity}, function(err, songs){
                if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to retrive songs!!",
                        err: err
                    })
                } else if(songs) {
                    res.status(200).send({
                        success: true,
                        songs: songs
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "No songs found!!",
                    })
                }
            })
        } catch(err) {
            res.status(404).send({
                success: false,
                msg: "Failed to retrive songs!!",
                err: err
            })
        }
    },

    get_artist_songs: function(req, res) {
        if(!req.params.id) {
            res.status(404).send({
                success: false,
                msg: "Artist ID should be entered!!",
            })
        } else {
            User.findById({_id: req.params.id}, function(err, user){
                if(user) {
                    Song.findRandom({artist_id: req.params.id},{},{limit: Infinity}, function(err, songs){
                        if(err) {
                            res.status(404).send({
                                success: false,
                                msg: "Failed to retrive songs!!",
                                err: err
                            })
                        } else if(songs) {
                            res.status(200).send({
                                success: true,
                                songs: songs
                            })
                        } else {
                            res.status(404).send({
                                success: false,
                                msg: "No songs found!!",
                            })
                        }
                    })
                } else if(!user) {
                    res.status(404).send({
                        success: false,
                        msg: "User does not exist!!"
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to retrive songs!!",
                        err: err
                    })
                }
            })
        }
    },
    add_listen: async function(req, res) {
        if(!req.params.id) {
            res.status(404).send({
                success: false,
                msg: "Song ID needed!!"
            })
        } else {
            Song.findOneAndUpdate({_id: req.params.id}, 
                {$inc:{listens: 1}}, async function(err, song) {
                    if(err) {
                        res.status(404).send({
                            success: false,
                            msg: "Failed to add listen!!",
                            err: err
                        })
                    } else if(song) {
                        await Support.updateMany(
                            {'supported_song._id': req.params.id},
                            {$inc: {'supported_song.listens': 1}}
                        )
                        res.status(200).send({
                            success: true,
                            msg: "Successfully added listen!!"
                        }) 
                    } else {
                        res.status(404).send({
                            success: false,
                            msg: "Song does not exists!!",
                        })
                    }
                })
        }
    },

    delete_song: async function(req, res) {
        if(!req.body.song_id || !req.body.user_id) {
            res.status(404).send({
                success: false,
                msg: "All fields are required!!",
            })
        } else {
            Song.findById({_id: req.body.song_id}, async function(err, song) {
                if(song) {
                    Song.findOne({
                        _id: req.body.song_id,
                        artist_id: req.body.user_id
                    }, async function(err, song){
                        if(song) {
                            if(song.album_name == 'Single') {
                                await Song.deleteOne({_id: req.body.song_id}, async function(err, song){
                                    if(song) {
                                        await Playlist.updateMany(
                                            {playlist_songs: {"$in" : req.body.song_id}},
                                            {$pull: {playlist_songs: req.body.song_id}}
                                        )
                                        res.status(200).send({
                                            success: true,
                                            msg: "Successfully deleted the song.",
                                        })
                                    } else {
                                        res.status(404).send({
                                            success: false,
                                            msg: "Error in deleting song!!",
                                            err: err
                                        })
                                    }
                                })
                            } else {
                                res.status(404).send({
                                    success: false,
                                    msg: "Remove this song from album first in order to delete!!",
                                    err: err
                                })
                            }
                        } else if(err) {
                            res.status(404).send({
                                success: false,
                                msg: "Error in deleting song!!",
                                err: err
                            })
                        } else {
                            res.status(404).send({
                                success: false,
                                msg: "This song does not belong to you!!",
                            })
                        }
                    })
                } else if(!song) {
                    res.status(404).send({
                        success: false,
                        msg: "Song does not exists!!",
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "Error in deleting song!!",
                        err: err
                    })
                }
            }) 
        }
    }
}

module.exports = functions