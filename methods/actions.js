const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))

const functions = {
    sign_up: function (req, res) {
        var valid = emailRegex.test(req.body.email)
        if(!req.body.email || !req.body.password || !req.body.retypePassword || !req.body.full_name || !req.body.username) {
            res.status(404).send({
                success: false,
                msg: "All fields are required!!"
            })
        } else if (!valid) {
            res.status(404).send({
                success: false,
                msg: "Not a valid email!!"
            })
        } else if( req.body.password != req.body.retypePassword){
            res.status(404).send({
                success: false,
                msg: "Password should match!!"
            })
        } else {
            User.findOne({
                username: req.body.username
            }, function(err, user) {
                if(!user) {
                    User.findOne({
                        email: req.body.email
                    }, function(err, user){
                        if(!user) {
                            var newUser = User({
                                full_name: req.body.full_name,
                                username: req.body.username,
                                email: req.body.email,
                                password: req.body.password,
                            })
                            newUser.save( async function (err, newUser) {
                                if(err) {
                                    res.status(404).send({
                                        success: false,
                                        msg: "Failed to Sign Up!!",
                                        err: err
                                    })
                                } else {
                                    var full_name = req.body.full_name
                                    var first_name = full_name.split(" ")[0]
                                    var username = req.body.username
                                    var email = req.body.email
                                    await transport.sendMail({
                                        to: req.body.email,
                                        from: "tamusanjiv6773@gmail.com",
                                        subject: "Welcome to Nuphonic",
                                        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                        
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta content="width=device-width, initial-scale=1" name="viewport">
                                            <meta name="x-apple-disable-message-reformatting">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta content="telephone=no" name="format-detection">
                                            <title></title>
                                            <!--[if (mso 16)]>
                                            <style type="text/css">
                                            a {text-decoration: none;}
                                            </style>
                                            <![endif]-->
                                            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                                            <!--[if gte mso 9]>
                                        <xml>
                                            <o:OfficeDocumentSettings>
                                            <o:AllowPNG></o:AllowPNG>
                                            <o:PixelsPerInch>96</o:PixelsPerInch>
                                            </o:OfficeDocumentSettings>
                                        </xml>
                                        <![endif]-->
                                            <!--[if !mso]><!-- -->
                                            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
                                            <!--<![endif]-->
                                        </head>
                                        
                                        <body>
                                            <div class="es-wrapper-color">
                                                <!--[if gte mso 9]>
                                                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                                        <v:fill type="tile" color="#eeeeee"></v:fill>
                                                    </v:background>
                                                <![endif]-->
                                                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-email-paddings" valign="top">
                                                                <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr></tr>
                                                                        <tr>
                                                                            <td class="esd-stripe" esd-custom-block-id="7681" align="center">
                                                                                <table class="es-header-body" style="background-color: #060607;" width="600" cellspacing="0" cellpadding="0" bgcolor="#060607" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-structure es-p35t es-p35b es-p35r es-p35l" align="left">
                                                                                                <table cellspacing="0" cellpadding="0" width="100%">
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td class="es-m-p0r esd-container-frame" width="530" valign="top" align="center">
                                                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                                    <tbody>
                                                                                                                        <tr>
                                                                                                                            <td class="esd-block-text es-m-txt-c es-p20r es-p20l" align="center">
                                                                                                                                <h1 style="color: #7b4bff; line-height: 100%;">Welcome ${first_name},</h1>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-stripe" align="center">
                                                                                <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-structure es-p35b es-p25r es-p25l" esd-custom-block-id="7685" style="background-color: #000000;" bgcolor="#000000" align="left">
                                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td class="esd-container-frame" width="550" valign="top" align="center">
                                                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                                    <tbody>
                                                                                                                        <tr>
                                                                                                                            <td class="esd-block-text es-p15t es-p15b es-p20r es-p20l" align="center">
                                                                                                                                <p style="font-size: 16px; color: #777777;">Thanks for trying our product. We are thrilled to have on the board.</p>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td align="center" class="esd-block-text es-p30t es-p30b es-m-txt-r" bgcolor="#000000">
                                                                                                                                <p style="color: #777777; line-height: 200%;"><strong>Your Username:&nbsp; ${username}<br>Your Email: ${email}</strong></p>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                                                                <p style="color: #777777;">If you are having some problem feel free to email us in this contact(tamusanjiv6773@gmail.com).<br><br><br>Thank You!</p>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                            <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://i.imgur.com/kUhFdU2.png" alt style="display: block;" width="550"></a></td>
                                                                                                                        </tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </body>
                                        
                                        </html>`
                                    })
                                    res.status(200).send({
                                        success: true,
                                        id: newUser.id,
                                        msg: "Signed Up Successfully"
                                    })
                                }
                            })
                        } else if(err) {
                            res.status(404).send({
                                success: false,
                                msg: "Failed to Sign Up!!",
                                err: err
                            })
                        } else {
                            res.status(404).send({
                                success: false,
                                msg: "User already exists!!"
                            })
                        }
                    })
                } else if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to Sign Up!!",
                        err: err
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "Username should be unique!!"
                    })
                }
            })
        }
    },
    sign_in: function(req, res) {
        var valid = emailRegex.test(req.body.email)
        if(!req.body.email || !req.body.password) {
            res.status(404).send({
                success: true,
                msg: "All fields are required!!"
            })
        } else if (!valid) {
            res.status(404).send({
                success: false,
                msg: "Not a valid email!!"
            })
        } else {
            User.findOne({
                email: req.body.email
            }, function(err, user) {
                if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to Sign In!!",
                        err: err
                    })
                } else if(!user) {
                    res.status(404).send({
                        success: false,
                        msg: "User not found!!"
                    })
                } else if (user && user.password == req.body.password) {
                    res.status(200).send({
                        success: true,
                        id: user.id,
                        msg: "Signed In Successfully"
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "Wrong Password!!"
                    })
                }
            })
        }
    },
    get_info: async function(req, res) {
        try {
            const user = await User.findById(req.params.id)
            res.status(200).send({
                success: true,
                user: user
            })
        } catch(err) {
            res.status(404).send({
                success: false,
                msg: "Failed to retrive User!!",
                err: err
            })
        }
        
    },
    change_password: async function(req, res) {
        try {
            const user = await User.findById(req.params.id)
            if(!req.body.newPassword || !req.body.currentPassword) {
                res.status(404).send({
                    success: false,
                    msg: "All fields are required!!"
                })
            } else { 
                if(user.password == req.body.currentPassword && req.body.newPassword != user.password) {
                    await User.updateOne({_id: req.params.id}, 
                        { $set: {password: req.body.newPassword}})
                    res.status(200).send({
                        success: true,
                        msg: "Password Successfully Changed"
                    })
                } else if (req.body.currentPassword != user.password){
                    res.status(404).send({
                        success: false,
                        msg: "Previous password didn't match!!"
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: "New password shouldn't match with current password!!"
                    })
                }
            }
        } catch(err) {
            res.status(404).send({
                success: false,
                msg: "Failed to Change!!",
                err: err
            })
        }
    },
    delete_user: async function(req, res) {
        try {
            const user = await User.findById(req.params.id)
            if(user) {
                await User.deleteOne({_id: req.params.id})
                res.status(200).send({
                    success: true,
                    msg: `Deleted account successfully`
                })
            } else {
                res.status(404).send({
                    success: false,
                    msg: "User not found!!"
                })
            }
        } catch {
            res.status(404).send({
                success: false,
                msg: "Failed to Delete!!",
                err: err
            })
        }
    },
    forgot_password: async function(req, res) {
        if(!req.body.email) {
            res.status(200).send({
                success: true,
                msg: `Email required!!`
            })
        } else {
            await User.findOne({email: req.body.email}, async (err, user) => {
                if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to reset!!",
                        err: err
                    })
                }
                else if(!user) {
                    res.status(404).send({
                        success: false,
                        msg: "User not found!!"
                    })
                } else {
                    var code = Math.floor(1000 + Math.random() * 9000)
                    await User.updateOne({email: req.body.email}, 
                        { $set: {reset_code: code}})
                    const user = await User.findOne({email: req.body.email})
                    var full_name = user.full_name
                    var first_name = full_name.split(" ")[0]
                    await transport.sendMail({
                        to: req.body.email,
                        from: "tamusanjiv6773@gmail.com",
                        subject: "Reset Password",
                        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                        
                        <head>
                            <meta charset="UTF-8">
                            <meta content="width=device-width, initial-scale=1" name="viewport">
                            <meta name="x-apple-disable-message-reformatting">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta content="telephone=no" name="format-detection">
                            <title></title>
                            <!--[if (mso 16)]>
                            <style type="text/css">
                            a {text-decoration: none;}
                            </style>
                            <![endif]-->
                            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                            <!--[if gte mso 9]>
                        <xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG></o:AllowPNG>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                            <!--[if !mso]><!-- -->
                            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
                            <!--<![endif]-->
                        </head>
                        
                        <body>
                            <div class="es-wrapper-color">
                                <!--[if gte mso 9]>
                                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                        <v:fill type="tile" color="#eeeeee"></v:fill>
                                    </v:background>
                                <![endif]-->
                                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td class="esd-email-paddings" valign="top">
                                                <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr></tr>
                                                        <tr>
                                                            <td class="esd-stripe" esd-custom-block-id="7681" align="center">
                                                                <table class="es-header-body" style="background-color: #060607;" width="600" cellspacing="0" cellpadding="0" bgcolor="#060607" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-structure es-p35t es-p35b es-p35r es-p35l" align="left">
                                                                                <table cellspacing="0" cellpadding="0" width="100%">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="es-m-p0r esd-container-frame" width="530" valign="top" align="center">
                                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td class="esd-block-text es-m-txt-c es-p20r es-p20l" align="center">
                                                                                                                <h1 style="color: #7b4bff; line-height: 100%;">Confirm your code</h1>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-stripe" align="center">
                                                                <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-structure es-p35b es-p25r es-p25l" esd-custom-block-id="7685" style="background-color: #000000;" bgcolor="#000000" align="left">
                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-container-frame" width="550" valign="top" align="center">
                                                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td class="esd-block-text es-m-txt-l es-p20t es-p20r es-p20l" align="center">
                                                                                                                <h3 style="font-size: 18px; color: #efebeb;">Hello ${first_name},</h3>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td class="esd-block-text es-p15t es-p5b es-p20r es-p20l" align="center">
                                                                                                                <p style="font-size: 16px; color: #777777;">Here is the&nbsp;confirmation code for resetting password:</p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td align="center" class="esd-block-text">
                                                                                                                <p style="color: #ffffff; font-size: 50px;"><strong>${code}</strong></p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td align="center" class="esd-block-text es-p20r es-p20l">
                                                                                                                <p style="color: #777777;">All you need is to copy this confirmation code and paste it to your textfield to proceed in resetting password.</p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://i.imgur.com/kUhFdU2.png" alt style="display: block;" width="550"></a></td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </body>
                        
                        </html>`
                    })
                    res.status(200).send({
                        success: true,
                        msg: "Code Sent"
                    })
                }
            })
        }         
    },
    confirm_code: async function(req, res) {
        if(!req.body.code || !req.body.email) {
            res.status(404).send({
                success: false,
                msg: "Code and Email Needed!!"
            })
        } else {
            const user = await User.findOne({email: req.body.email})
            var sent_code = user.reset_code
            if(req.body.code==sent_code) {
                res.status(200).send({
                    success: true,
                    msg: "Successfull"
                })
            } else {
                res.status(404).send({
                    success: false,
                    msg: "Incorrect Code!!"
                })
            }
        }
    },  
    reset_password: async function(req, res) {
        if(!req.body.password || !req.body.retypePassword || !req.body.email) {
            res.status(404).send({
                success: false,
                msg: "All fields required!!"
            })
        } else {
            await User.findOne({email: req.body.email}, async (err,user) => {
                if(err) {
                    res.status(404).send({
                        success: false,
                        msg: "Failed to reset!!",
                        err: err
                    })
                }
                else if(!user) {
                    res.status(404).send({
                        success: false,
                        msg: "User not found!!"
                    })
                } else if (req.body.password != req.body.retypePassword) {
                    res.status(404).send({
                        success: false,
                        msg: "Both password should match!!"
                    })
                } else {
                    await User.updateOne({email: req.body.email},{
                        $set: {
                            password: req.body.password,
                            reset_code: null
                        }
                    }).then(
                        res.status(200).send({
                            success: true,
                            msg: "Reset Password Successful"
                        })
                    ) 
                }
            })
        }
    }   
        
}

module.exports = functions