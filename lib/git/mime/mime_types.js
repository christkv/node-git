var sys = require('sys');

// All the mime types
var mime_definition = "  # application/*\n\
application/activemessage 'IANA,[Shapiro]\n\
application/andrew-inset 'IANA,[Borenstein]\n\
application/applefile :base64 'IANA,[Faltstrom]\n\
application/atom+xml @atom :8bit 'IANA,RFC4287,RFC5023\n\
application/atomcat+xml :8bit 'IANA,RFC5023\n\
application/atomicmail 'IANA,[Borenstein]\n\
application/atomsvc+xml :8bit 'IANA,RFC5023\n\
application/auth-policy+xml :8bit 'IANA,RFC4745\n\
application/batch-SMTP 'IANA,RFC2442\n\
application/beep+xml 'IANA,RFC3080\n\
application/cals-1840 'IANA,RFC1895\n\
application/ccxml+xml 'IANA,RFC4267\n\
application/cea-2018+xml 'IANA,[Zimmermann]\n\
application/cellml+xml 'IANA,RFC4708\n\
application/cnrp+xml 'IANA,RFC3367\n\
application/commonground 'IANA,[Glazer]\n\
application/conference-info+xml 'IANA,RFC4575\n\
application/cpl+xml 'IANA,RFC3880\n\
application/csta+xml 'IANA,[Ecma International Helpdesk]\n\
application/CSTAdata+xml 'IANA,[Ecma International Helpdesk]\n\
application/cybercash 'IANA,[Eastlake]\n\
application/davmount+xml 'IANA,RFC4709\n\
application/dca-rft 'IANA,[Campbell]\n\
application/dec-dx 'IANA,[Campbell]\n\
application/dialog-info+xml 'IANA,RFC4235\n\
application/dicom 'IANA,RFC3240\n\
application/dns 'IANA,RFC4027\n\
application/dvcs 'IANA,RFC3029\n\
application/ecmascript 'IANA,RFC4329\n\
application/EDI-Consent 'IANA,RFC1767\n\
application/EDI-X12 'IANA,RFC1767\n\
application/EDIFACT 'IANA,RFC1767\n\
application/emma+xml 'IANA,[W3C]\n\
application/epp+xml 'IANA,RFC3730\n\
application/eshop 'IANA,[Katz]\n\
application/fastinfoset 'IANA,[ITU-T ASN.1 Rapporteur]\n\
application/fastsoap 'IANA,[ITU-T ASN.1 Rapporteur]\n\
application/fits 'IANA,RFC4047\n\
application/font-tdpfr @pfr 'IANA,RFC3073\n\
application/H224 'IANA,RFC4573\n\
application/http 'IANA,RFC2616\n\
application/hyperstudio @stk 'IANA,[Domino]\n\
application/ibe-key-request+xml 'IANA,RFC5408\n\
application/ibe-pkg-reply+xml 'IANA,RFC5408\n\
application/ibe-pp-data 'IANA,RFC5408\n\
application/iges 'IANA,[Parks]\n\
application/im-iscomposing+xml 'IANA,RFC3994\n\
application/index 'IANA,RFC2652\n\
application/index.cmd 'IANA,RFC2652\n\
application/index.obj 'IANA,RFC2652\n\
application/index.response 'IANA,RFC2652\n\
application/index.vnd 'IANA,RFC2652\n\
application/iotp 'IANA,RFC2935\n\
application/ipp 'IANA,RFC2910\n\
application/isup 'IANA,RFC3204\n\
application/javascript @js :8bit 'IANA,RFC4329\n\
application/json @json :8bit 'IANA,RFC4627\n\
application/kpml-request+xml 'IANA,RFC4730\n\
application/kpml-response+xml 'IANA,RFC4730\n\
application/lost+xml 'IANA,RFC5222\n\
application/mac-binhex40 @hqx :8bit 'IANA,[Faltstrom]\n\
application/macwriteii 'IANA,[Lindner]\n\
application/marc 'IANA,RFC2220\n\
application/mathematica 'IANA,[Wolfram]\n\
application/mbms-associated-procedure-description+xml 'IANA,[3GPP]\n\
application/mbms-deregister+xml 'IANA,[3GPP]\n\
application/mbms-envelope+xml 'IANA,[3GPP]\n\
application/mbms-msk+xml 'IANA,[3GPP]\n\
application/mbms-msk-response+xml 'IANA,[3GPP]\n\
application/mbms-protection-description+xml 'IANA,[3GPP]\n\
application/mbms-reception-report+xml 'IANA,[3GPP]\n\
application/mbms-register+xml 'IANA,[3GPP]\n\
application/mbms-register-response+xml 'IANA,[3GPP]\n\
application/mbms-user-service-description+xml 'IANA,[3GPP]\n\
application/mbox 'IANA,RFC4155\n\
application/media_control+xml 'IANA,RFC5168\n\
application/mediaservercontrol+xml 'IANA,RFC5022\n\
application/mikey 'IANA,RFC3830\n\
application/moss-keys 'IANA,RFC1848\n\
application/moss-signature 'IANA,RFC1848\n\
application/mosskey-data 'IANA,RFC1848\n\
application/mosskey-request 'IANA,RFC1848\n\
application/mp4 'IANA,RFC4337\n\
application/mpeg4-generic 'IANA,RFC3640\n\
application/mpeg4-iod 'IANA,RFC4337\n\
application/mpeg4-iod-xmt 'IANA,RFC4337\n\
application/msword @doc,dot,wrd :base64 'IANA,[Lindner]\n\
application/mxf 'IANA,RFC4539\n\
application/nasdata 'IANA,RFC4707\n\
application/news-transmission 'IANA,RFC1036,[Spencer]\n\
application/nss 'IANA,[Hammer]\n\
application/ocsp-request 'IANA,RFC2560\n\
application/ocsp-response 'IANA,RFC2560\n\
application/octet-stream @bin,dms,lha,lzh,exe,class,ani,pgp,so,dll,dmg,dylib :base64 'IANA,RFC2045,RFC2046\n\
application/oda @oda 'IANA,RFC2045,RFC2046\n\
application/oebps-package+xml 'IANA,RFC4839\n\
application/ogg @ogx 'IANA,RFC5334\n\
application/parityfec 'IANA,RFC5109\n\
application/patch-ops-error+xml 'IANA,RFC5261\n\
application/pdf @pdf :base64 'IANA,RFC3778\n\
application/pgp-encrypted :7bit 'IANA,RFC3156\n\
application/pgp-keys :7bit 'IANA,RFC3156\n\
application/pgp-signature @sig :base64 'IANA,RFC3156\n\
application/pidf+xml 'IANA,RFC3863\n\
application/pidf-diff+xml 'IANA,RFC5262\n\
application/pkcs10 @p10 'IANA,RFC2311\n\
application/pkcs7-mime @p7m,p7c 'IANA,RFC2311\n\
application/pkcs7-signature @p7s 'IANA,RFC2311\n\
application/pkix-cert @cer 'IANA,RFC2585\n\
application/pkix-crl @crl 'IANA,RFC2585\n\
application/pkix-pkipath @pkipath 'IANA,RFC4366\n\
application/pkixcmp @pki 'IANA,RFC2510\n\
application/pls+xml 'IANA,RFC4267\n\
application/poc-settings+xml 'IANA,RFC4354\n\
application/postscript @ai,eps,ps :8bit 'IANA,RFC2045,RFC2046\n\
application/prs.alvestrand.titrax-sheet 'IANA,[Alvestrand]\n\
application/prs.cww @cw,cww 'IANA,[Rungchavalnont]\n\
application/prs.nprend @rnd,rct 'IANA,[Doggett]\n\
application/prs.plucker 'IANA,[Janssen]\n\
application/qsig 'IANA,RFC3204\n\
application/rdf+xml @rdf :8bit 'IANA,RFC3870\n\
application/reginfo+xml 'IANA,RFC3680\n\
application/relax-ng-compact-syntax 'IANA,{ISO/IEC 1957-2:2003/FDAM-1=http://www.jtc1sc34.org/repository/0661.pdf}\n\
application/remote-printing 'IANA,RFC1486,[Rose]\n\
application/resource-lists+xml 'IANA,RFC4826\n\
application/resource-lists-diff+xml 'IANA,RFC5362\n\
application/riscos 'IANA,[Smith]\n\
application/rlmi+xml 'IANA,RFC4662\n\
application/rls-services+xml 'IANA,RFC4826\n\
application/rtf @rtf 'IANA,[Lindner]\n\
application/rtx 'IANA,RFC4588\n\
application/samlassertion+xml 'IANA,[OASIS Security Services Technical Committee (SSTC)]\n\
application/samlmetadata+xml 'IANA,[OASIS Security Services Technical Committee (SSTC)]\n\
application/sbml+xml 'IANA,RFC3823\n\
application/scvp-cv-request 'IANA,RFC5055\n\
application/scvp-cv-response 'IANA,RFC5055\n\
application/scvp-vp-request 'IANA,RFC5055\n\
application/scvp-vp-response 'IANA,RFC5055\n\
application/sdp 'IANA,RFC4566\n\
application/set-payment 'IANA,[Korver]\n\
application/set-payment-initiation 'IANA,[Korver]\n\
application/set-registration 'IANA,[Korver]\n\
application/set-registration-initiation 'IANA,[Korver]\n\
application/sgml @sgml 'IANA,RFC1874\n\
application/sgml-open-catalog @soc 'IANA,[Grosso]\n\
application/shf+xml 'IANA,RFC4194\n\
application/sieve @siv 'IANA,RFC5228\n\
application/simple-filter+xml 'IANA,RFC4661\n\
application/simple-message-summary 'IANA,RFC3842\n\
application/simpleSymbolContainer 'IANA,[3GPP]\n\
application/slate 'IANA,[Crowley]\n\
application/smil+xml @smi,smil :8bit 'IANA,RFC4536\n\
application/soap+fastinfoset 'IANA,[ITU-T ASN.1 Rapporteur]\n\
application/soap+xml 'IANA,RFC3902\n\
application/sparql-query 'IANA,[W3C]\n\
application/sparql-results+xml 'IANA,[W3C]\n\
application/spirits-event+xml 'IANA,RFC3910\n\
application/srgs 'IANA,RFC4267\n\
application/srgs+xml 'IANA,RFC4267\n\
application/ssml+xml 'IANA,RFC4267\n\
application/timestamp-query 'IANA,RFC3161\n\
application/timestamp-reply 'IANA,RFC3161\n\
application/tve-trigger 'IANA,[Welsh]\n\
application/ulpfec 'IANA,RFC5109\n\
application/vemmi 'IANA,RFC2122\n\
application/vnd.3gpp.bsf+xml 'IANA,[Meredith]\n\
application/vnd.3gpp.pic-bw-large @plb 'IANA,[Meredith]\n\
application/vnd.3gpp.pic-bw-small @psb 'IANA,[Meredith]\n\
application/vnd.3gpp.pic-bw-var @pvb 'IANA,[Meredith]\n\
application/vnd.3gpp.sms @sms 'IANA,[Meredith]\n\
application/vnd.3gpp2.bcmcsinfo+xml 'IANA,[Dryden]\n\
application/vnd.3gpp2.sms 'IANA,[Mahendran]\n\
application/vnd.3gpp2.tcap 'IANA,[Mahendran]\n\
application/vnd.3M.Post-it-Notes 'IANA,[O'Brien]\n\
application/vnd.accpac.simply.aso 'IANA,[Leow]\n\
application/vnd.accpac.simply.imp 'IANA,[Leow]\n\
application/vnd.acucobol 'IANA,[Lubin]\n\
application/vnd.acucorp @atc,acutc :7bit 'IANA,[Lubin]\n\
application/vnd.adobe.xdp+xml 'IANA,[Brinkman]\n\
application/vnd.adobe.xfdf @xfdf 'IANA,[Perelman]\n\
application/vnd.aether.imp 'IANA,[Moskowitz]\n\
application/vnd.airzip.filesecure.azf 'IANA,[Mould],[Clueit]\n\
application/vnd.airzip.filesecure.azs 'IANA,[Mould],[Clueit]\n\
application/vnd.americandynamics.acc 'IANA,[Sands]\n\
application/vnd.amiga.ami @ami 'IANA,[Blumberg]\n\
application/vnd.anser-web-certificate-issue-initiation 'IANA,[Mori]\n\
application/vnd.antix.game-component 'IANA,[Shelton]\n\
application/vnd.apple.installer+xml 'IANA,[Bierman]\n\
application/vnd.arastra.swi 'IANA,[Fenner]\n\
application/vnd.audiograph 'IANA,[Slusanschi]\n\
application/vnd.autopackage 'IANA,[Hearn]\n\
application/vnd.avistar+xml 'IANA,[Vysotsky]\n\
application/vnd.blueice.multipass @mpm 'IANA,[Holmstrom]\n\
application/vnd.bluetooth.ep.oob 'IANA,[Foley]\n\
application/vnd.bmi 'IANA,[Gotoh]\n\
application/vnd.businessobjects 'IANA,[Imoucha]\n\
application/vnd.cab-jscript 'IANA,[Falkenberg]\n\
application/vnd.canon-cpdl 'IANA,[Muto]\n\
application/vnd.canon-lips 'IANA,[Muto]\n\
application/vnd.cendio.thinlinc.clientconf 'IANA,[Åstrand=Astrand]\n\
application/vnd.chemdraw+xml 'IANA,[Howes]\n\
application/vnd.chipnuts.karaoke-mmd 'IANA,[Xiong]\n\
application/vnd.cinderella @cdy 'IANA,[Kortenkamp]\n\
application/vnd.cirpack.isdn-ext 'IANA,[Mayeux]\n\
application/vnd.claymore 'IANA,[Simpson]\n\
application/vnd.clonk.c4group 'IANA,[Brammer]\n\
application/vnd.commerce-battelle 'IANA,[Applebaum]\n\
application/vnd.commonspace 'IANA,[Chandhok]\n\
application/vnd.contact.cmsg 'IANA,[Patz]\n\
application/vnd.cosmocaller @cmc 'IANA,[Dellutri]\n\
application/vnd.crick.clicker 'IANA,[Burt]\n\
application/vnd.crick.clicker.keyboard 'IANA,[Burt]\n\
application/vnd.crick.clicker.palette 'IANA,[Burt]\n\
application/vnd.crick.clicker.template 'IANA,[Burt]\n\
application/vnd.crick.clicker.wordbank 'IANA,[Burt]\n\
application/vnd.criticaltools.wbs+xml @wbs 'IANA,[Spiller]\n\
application/vnd.ctc-posml 'IANA,[Kohlhepp]\n\
application/vnd.ctct.ws+xml 'IANA,[Ancona]\n\
application/vnd.cups-pdf 'IANA,[Sweet]\n\
application/vnd.cups-postscript 'IANA,[Sweet]\n\
application/vnd.cups-ppd 'IANA,[Sweet]\n\
application/vnd.cups-raster 'IANA,[Sweet]\n\
application/vnd.cups-raw 'IANA,[Sweet]\n\
application/vnd.curl @curl 'IANA,[Byrnes]\n\
application/vnd.cybank 'IANA,[Helmee]\n\
application/vnd.data-vision.rdz @rdz 'IANA,[Fields]\n\
application/vnd.denovo.fcselayout-link 'IANA,[Dixon]\n\
application/vnd.dir-bi.plate-dl-nosuffix 'IANA,[Yamanaka]\n\
application/vnd.dna 'IANA,[Searcy]\n\
application/vnd.dpgraph 'IANA,[Parker]\n\
application/vnd.dreamfactory @dfac 'IANA,[Appleton]\n\
application/vnd.dvb.esgcontainer 'IANA,[Heuer]\n\
application/vnd.dvb.ipdcesgaccess 'IANA,[Heuer]\n\
application/vnd.dvb.iptv.alfec-base 'IANA,[Henry]\n\
application/vnd.dvb.iptv.alfec-enhancement 'IANA,[Henry]\n\
application/vnd.dvb.notif-container+xml 'IANA,[Yue]\n\
application/vnd.dvb.notif-generic+xml 'IANA,[Yue]\n\
application/vnd.dvb.notif-ia-msglist+xml 'IANA,[Yue]\n\
application/vnd.dvb.notif-ia-registration-request+xml 'IANA,[Yue]\n\
application/vnd.dvb.notif-ia-registration-response+xml 'IANA,[Yue]\n\
application/vnd.dxr 'IANA,[Duffy]\n\
application/vnd.ecdis-update 'IANA,[Buettgenbach]\n\
application/vnd.ecowin.chart 'IANA,[Olsson]\n\
application/vnd.ecowin.filerequest 'IANA,[Olsson]\n\
application/vnd.ecowin.fileupdate 'IANA,[Olsson]\n\
application/vnd.ecowin.series 'IANA,[Olsson]\n\
application/vnd.ecowin.seriesrequest 'IANA,[Olsson]\n\
application/vnd.ecowin.seriesupdate 'IANA,[Olsson]\n\
application/vnd.emclient.accessrequest+xml 'IANA,[Navara]\n\
application/vnd.enliven 'IANA,[Santinelli]\n\
application/vnd.epson.esf 'IANA,[Hoshina]\n\
application/vnd.epson.msf 'IANA,[Hoshina]\n\
application/vnd.epson.quickanime 'IANA,[Gu]\n\
application/vnd.epson.salt 'IANA,[Nagatomo]\n\
application/vnd.epson.ssf 'IANA,[Hoshina]\n\
application/vnd.ericsson.quickcall 'IANA,[Tidwell]\n\
application/vnd.eszigno3+xml 'IANA,[Tóth=Toth]\n\
application/vnd.eudora.data 'IANA,[Resnick]\n\
application/vnd.ezpix-album 'IANA,[Electronic Zombie, Corp.=ElectronicZombieCorp]\n\
application/vnd.ezpix-package 'IANA,[Electronic Zombie, Corp.=ElectronicZombieCorp]\n\
application/vnd.f-secure.mobile 'IANA,[Sarivaara]\n\
application/vnd.fdf 'IANA,[Zilles]\n\
application/vnd.fdsn.mseed 'IANA,[Ratzesberger]\n\
application/vnd.ffsns 'IANA,[Holstage]\n\
application/vnd.fints 'IANA,[Hammann]\n\
application/vnd.FloGraphIt 'IANA,[Floersch]\n\
application/vnd.fluxtime.clip 'IANA,[Winter]\n\
application/vnd.font-fontforge-sfd 'IANA,[Williams]\n\
application/vnd.framemaker @frm,maker,frame,fm,fb,book,fbdoc 'IANA,[Wexler]\n\
application/vnd.frogans.fnc 'IANA,[Tamas]\n\
application/vnd.frogans.ltf 'IANA,[Tamas]\n\
application/vnd.fsc.weblaunch @fsc :7bit 'IANA,[D.Smith]\n\
application/vnd.fujitsu.oasys 'IANA,[Togashi]\n\
application/vnd.fujitsu.oasys2 'IANA,[Togashi]\n\
application/vnd.fujitsu.oasys3 'IANA,[Okudaira]\n\
application/vnd.fujitsu.oasysgp 'IANA,[Sugimoto]\n\
application/vnd.fujitsu.oasysprs 'IANA,[Ogita]\n\
application/vnd.fujixerox.ART-EX 'IANA,[Tanabe]\n\
application/vnd.fujixerox.ART4 'IANA,[Tanabe]\n\
application/vnd.fujixerox.ddd 'IANA,[Onda]\n\
application/vnd.fujixerox.docuworks 'IANA,[Taguchi]\n\
application/vnd.fujixerox.docuworks.binder 'IANA,[Matsumoto]\n\
application/vnd.fujixerox.HBPL 'IANA,[Tanabe]\n\
application/vnd.fut-misnet 'IANA,[Pruulmann]\n\
application/vnd.fuzzysheet 'IANA,[Birtwistle]\n\
application/vnd.genomatix.tuxedo @txd 'IANA,[Frey]\n\
application/vnd.geogebra.file 'IANA,[GeoGebra],[Kreis]\n\
application/vnd.gmx 'IANA,[Sciberras]\n\
application/vnd.google-earth.kml+xml @kml :8bit 'IANA,[Ashbridge]\n\
application/vnd.google-earth.kmz @kmz :8bit 'IANA,[Ashbridge]\n\
application/vnd.grafeq 'IANA,[Tupper]\n\
application/vnd.gridmp 'IANA,[Lawson]\n\
application/vnd.groove-account 'IANA,[Joseph]\n\
application/vnd.groove-help 'IANA,[Joseph]\n\
application/vnd.groove-identity-message 'IANA,[Joseph]\n\
application/vnd.groove-injector 'IANA,[Joseph]\n\
application/vnd.groove-tool-message 'IANA,[Joseph]\n\
application/vnd.groove-tool-template 'IANA,[Joseph]\n\
application/vnd.groove-vcard 'IANA,[Joseph]\n\
application/vnd.HandHeld-Entertainment+xml 'IANA,[Hamilton]\n\
application/vnd.hbci @hbci,hbc,kom,upa,pkd,bpd 'IANA,[Hammann]\n\
application/vnd.hcl-bireports 'IANA,[Serres]\n\
application/vnd.hhe.lesson-player @les 'IANA,[Jones]\n\
application/vnd.hp-HPGL @plt,hpgl 'IANA,[Pentecost]\n\
application/vnd.hp-hpid 'IANA,[Gupta]\n\
application/vnd.hp-hps 'IANA,[Aubrey]\n\
application/vnd.hp-jlyt 'IANA,[Gaash]\n\
application/vnd.hp-PCL 'IANA,[Pentecost]\n\
application/vnd.hp-PCLXL 'IANA,[Pentecost]\n\
application/vnd.httphone 'IANA,[Lefevre]\n\
application/vnd.hydrostatix.sof-data 'IANA,[Gillam]\n\
application/vnd.hzn-3d-crossword 'IANA,[Minnis]\n\
application/vnd.ibm.afplinedata 'IANA,[Buis]\n\
application/vnd.ibm.electronic-media @emm 'IANA,[Tantlinger]\n\
application/vnd.ibm.MiniPay 'IANA,[Herzberg]\n\
application/vnd.ibm.modcap 'IANA,[Hohensee]\n\
application/vnd.ibm.rights-management @irm 'IANA,[Tantlinger]\n\
application/vnd.ibm.secure-container @sc 'IANA,[Tantlinger]\n\
application/vnd.iccprofile 'IANA,[Green]\n\
application/vnd.igloader 'IANA,[Fisher]\n\
application/vnd.immervision-ivp 'IANA,[Villegas]\n\
application/vnd.immervision-ivu 'IANA,[Villegas]\n\
application/vnd.informedcontrol.rms+xml 'IANA,[Wahl]\n\
application/vnd.informix-visionary 'IANA,[Gales]\n\
application/vnd.intercon.formnet 'IANA,[Gurak]\n\
application/vnd.intertrust.digibox 'IANA,[Tomasello]\n\
application/vnd.intertrust.nncp 'IANA,[Tomasello]\n\
application/vnd.intu.qbo 'IANA,[Scratchley]\n\
application/vnd.intu.qfx 'IANA,[Scratchley]\n\
application/vnd.iptc.g2.conceptitem+xml 'IANA,[Steidl]\n\
application/vnd.iptc.g2.knowledgeitem+xml 'IANA,[Steidl]\n\
application/vnd.iptc.g2.newsitem+xml 'IANA,[Steidl]\n\
application/vnd.iptc.g2.packageitem+xml 'IANA,[Steidl]\n\
application/vnd.ipunplugged.rcprofile @rcprofile 'IANA,[Ersson]\n\
application/vnd.irepository.package+xml @irp 'IANA,[Knowles]\n\
application/vnd.is-xpr 'IANA,[Natarajan]\n\
application/vnd.jam 'IANA,[B.Kumar]\n\
application/vnd.japannet-directory-service 'IANA,[Fujii]\n\
application/vnd.japannet-jpnstore-wakeup 'IANA,[Yoshitake]\n\
application/vnd.japannet-payment-wakeup 'IANA,[Fujii]\n\
application/vnd.japannet-registration 'IANA,[Yoshitake]\n\
application/vnd.japannet-registration-wakeup 'IANA,[Fujii]\n\
application/vnd.japannet-setstore-wakeup 'IANA,[Yoshitake]\n\
application/vnd.japannet-verification 'IANA,[Yoshitake]\n\
application/vnd.japannet-verification-wakeup 'IANA,[Fujii]\n\
application/vnd.jcp.javame.midlet-rms 'IANA,[Gorshenev]\n\
application/vnd.jisp @jisp 'IANA,[Deckers]\n\
application/vnd.joost.joda-archive 'IANA,[Joost]\n\
application/vnd.kahootz 'IANA,[Macdonald]\n\
application/vnd.kde.karbon @karbon 'IANA,[Faure]\n\
application/vnd.kde.kchart @chrt 'IANA,[Faure]\n\
application/vnd.kde.kformula @kfo 'IANA,[Faure]\n\
application/vnd.kde.kivio @flw 'IANA,[Faure]\n\
application/vnd.kde.kontour @kon 'IANA,[Faure]\n\
application/vnd.kde.kpresenter @kpr,kpt 'IANA,[Faure]\n\
application/vnd.kde.kspread @ksp 'IANA,[Faure]\n\
application/vnd.kde.kword @kwd,kwt 'IANA,[Faure]\n\
application/vnd.kenameaapp @htke 'IANA,[DiGiorgio-Haag]\n\
application/vnd.kidspiration @kia 'IANA,[Bennett]\n\
application/vnd.Kinar @kne,knp,sdf 'IANA,[Thakkar]\n\
application/vnd.koan 'IANA,[Cole]\n\
application/vnd.kodak-descriptor 'IANA,[Donahue]\n\
application/vnd.liberty-request+xml 'IANA,[McDowell]\n\
application/vnd.llamagraphics.life-balance.desktop @lbd 'IANA,[White]\n\
application/vnd.llamagraphics.life-balance.exchange+xml @lbe 'IANA,[White]\n\
application/vnd.lotus-1-2-3 @wks,123 'IANA,[Wattenberger]\n\
application/vnd.lotus-approach 'IANA,[Wattenberger]\n\
application/vnd.lotus-freelance 'IANA,[Wattenberger]\n\
application/vnd.lotus-notes 'IANA,[Laramie]\n\
application/vnd.lotus-organizer 'IANA,[Wattenberger]\n\
application/vnd.lotus-screencam 'IANA,[Wattenberger]\n\
application/vnd.lotus-wordpro 'IANA,[Wattenberger]\n\
application/vnd.macports.portpkg 'IANA,[Berry]\n\
application/vnd.marlin.drm.actiontoken+xml 'IANA,[Ellison]\n\
application/vnd.marlin.drm.conftoken+xml 'IANA,[Ellison]\n\
application/vnd.marlin.drm.license+xml 'IANA,[Ellison]\n\
application/vnd.marlin.drm.mdcf 'IANA,[Ellison]\n\
application/vnd.mcd @mcd 'IANA,[Gotoh]\n\
application/vnd.medcalcdata 'IANA,[Schoonjans]\n\
application/vnd.mediastation.cdkey 'IANA,[Flurry]\n\
application/vnd.meridian-slingshot 'IANA,[Wedel]\n\
application/vnd.MFER 'IANA,[Hirai]\n\
application/vnd.mfmp @mfm 'IANA,[Ikeda]\n\
application/vnd.micrografx.flo @flo 'IANA,[Prevo]\n\
application/vnd.micrografx.igx @igx 'IANA,[Prevo]\n\
application/vnd.mif @mif 'IANA,[Wexler]\n\
application/vnd.minisoft-hp3000-save 'IANA,[Bartram]\n\
application/vnd.mitsubishi.misty-guard.trustweb 'IANA,[Tanaka]\n\
application/vnd.Mobius.DAF 'IANA,[Kabayama]\n\
application/vnd.Mobius.DIS 'IANA,[Kabayama]\n\
application/vnd.Mobius.MBK 'IANA,[Devasia]\n\
application/vnd.Mobius.MQY 'IANA,[Devasia]\n\
application/vnd.Mobius.MSL 'IANA,[Kabayama]\n\
application/vnd.Mobius.PLC 'IANA,[Kabayama]\n\
application/vnd.Mobius.TXF 'IANA,[Kabayama]\n\
application/vnd.mophun.application @mpn 'IANA,[Wennerstrom]\n\
application/vnd.mophun.certificate @mpc 'IANA,[Wennerstrom]\n\
application/vnd.motorola.flexsuite 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.adsi 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.fis 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.gotap 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.kmr 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.ttc 'IANA,[Patton]\n\
application/vnd.motorola.flexsuite.wem 'IANA,[Patton]\n\
application/vnd.motorola.iprm 'IANA,[Shamsaasef]\n\
application/vnd.mozilla.xul+xml @xul 'IANA,[McDaniel]\n\
application/vnd.ms-artgalry @cil 'IANA,[Slawson]\n\
application/vnd.ms-asf @asf 'IANA,[Fleischman]\n\
application/vnd.ms-cab-compressed @cab 'IANA,[Scarborough]\n\
application/vnd.ms-excel @xls,xlt :base64 'IANA,[Gill]\n\
application/vnd.ms-fontobject 'IANA,[Scarborough]\n\
application/vnd.ms-ims 'IANA,[Ledoux]\n\
application/vnd.ms-lrm @lrm 'IANA,[Ledoux]\n\
application/vnd.ms-playready.initiator+xml 'IANA,[Schneider]\n\
application/vnd.ms-powerpoint @ppt,pps,pot :base64 'IANA,[Gill]\n\
application/vnd.ms-project @mpp :base64 'IANA,[Gill]\n\
application/vnd.ms-tnef :base64 'IANA,[Gill]\n\
application/vnd.ms-wmdrm.lic-chlg-req 'IANA,[Lau]\n\
application/vnd.ms-wmdrm.lic-resp 'IANA,[Lau]\n\
application/vnd.ms-wmdrm.meter-chlg-req 'IANA,[Lau]\n\
application/vnd.ms-wmdrm.meter-resp 'IANA,[Lau]\n\
application/vnd.ms-works :base64 'IANA,[Gill]\n\
application/vnd.ms-wpl @wpl :base64 'IANA,[Plastina]\n\
application/vnd.ms-xpsdocument @xps :8bit 'IANA,[McGatha]\n\
application/vnd.mseq @mseq 'IANA,[Le Bodic]\n\
application/vnd.msign 'IANA,[Borcherding]\n\
application/vnd.multiad.creator 'IANA,[Mills]\n\
application/vnd.multiad.creator.cif 'IANA,[Mills]\n\
application/vnd.music-niff 'IANA,[Butler]\n\
application/vnd.musician 'IANA,[Adams]\n\
application/vnd.muvee.style 'IANA,[Anantharamu]\n\
application/vnd.ncd.control 'IANA,[Tarkkala]\n\
application/vnd.ncd.reference 'IANA,[Tarkkala]\n\
application/vnd.nervana @ent,entity,req,request,bkm,kcm 'IANA,[Judkins]\n\
application/vnd.netfpx 'IANA,[Mutz]\n\
application/vnd.neurolanguage.nlu 'IANA,[DuFeu]\n\
application/vnd.noblenet-directory 'IANA,[Solomon]\n\
application/vnd.noblenet-sealer 'IANA,[Solomon]\n\
application/vnd.noblenet-web 'IANA,[Solomon]\n\
application/vnd.nokia.catalogs 'IANA,[Nokia]\n\
application/vnd.nokia.conml+wbxml 'IANA,[Nokia]\n\
application/vnd.nokia.conml+xml 'IANA,[Nokia]\n\
application/vnd.nokia.iptv.config+xml 'IANA,[Nokia]\n\
application/vnd.nokia.iSDS-radio-presets 'IANA,[Nokia]\n\
application/vnd.nokia.landmark+wbxml 'IANA,[Nokia]\n\
application/vnd.nokia.landmark+xml 'IANA,[Nokia]\n\
application/vnd.nokia.landmarkcollection+xml 'IANA,[Nokia]\n\
application/vnd.nokia.n-gage.ac+xml 'IANA,[Nokia]\n\
application/vnd.nokia.n-gage.data 'IANA,[Nokia]\n\
application/vnd.nokia.n-gage.symbian.install 'IANA,[Nokia]\n\
application/vnd.nokia.ncd+xml 'IANA,[Nokia]\n\
application/vnd.nokia.pcd+wbxml 'IANA,[Nokia]\n\
application/vnd.nokia.pcd+xml 'IANA,[Nokia]\n\
application/vnd.nokia.radio-preset @rpst 'IANA,[Nokia]\n\
application/vnd.nokia.radio-presets @rpss 'IANA,[Nokia]\n\
application/vnd.novadigm.EDM 'IANA,[Swenson]\n\
application/vnd.novadigm.EDX 'IANA,[Swenson]\n\
application/vnd.novadigm.EXT 'IANA,[Swenson]\n\
application/vnd.oasis.opendocument.chart @odc 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.chart-template @odc 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.database @odb 'IANA,[Schubert],[Oasis OpenDocument TC=OASIS OpenDocumentTC]\n\
application/vnd.oasis.opendocument.formula @odf 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.formula-template @odf 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.graphics @odg 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.graphics-template @otg 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.image @odi 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.image-template @odi 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.presentation @odp 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.presentation-template @otp 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.spreadsheet @ods 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.spreadsheet-template @ots 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.text @odt 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.text-master @odm 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.text-template @ott 'IANA,[Oppermann]\n\
application/vnd.oasis.opendocument.text-web @oth 'IANA,[Oppermann]\n\
application/vnd.obn 'IANA,[Hessling]\n\
application/vnd.olpc-sugar 'IANA,[Palmieri]\n\
application/vnd.oma-scws-config 'IANA,[Mahalal]\n\
application/vnd.oma-scws-http-request 'IANA,[Mahalal]\n\
application/vnd.oma-scws-http-response 'IANA,[Mahalal]\n\
application/vnd.oma.bcast.associated-procedure-parameter+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.drm-trigger+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.imd+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.ltkm 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.notification+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.provisioningtrigger 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.sgboot 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.sgdd+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.sgdu 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.simple-symbol-container 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.smartcard-trigger+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.sprov+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.bcast.stkm 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.dcd 'IANA,[Primo],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.dcdc 'IANA,[Primo],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.dd2+xml 'IANA,[Sato],[Open Mobile Alliance's BAC DLDRM Working Group]\n\
application/vnd.oma.drm.risd+xml 'IANA,[Rauschenbach],[OMNA - Open Mobile Naming Authority=OMNA-OpenMobileNamingAuthority]\n\
application/vnd.oma.group-usage-list+xml 'IANA,[Kelley],[OMA Presence and Availability (PAG) Working Group]\n\
application/vnd.oma.poc.detailed-progress-report+xml 'IANA,[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.oma.poc.final-report+xml 'IANA,[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.oma.poc.groups+xml 'IANA,[Kelley],[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.oma.poc.invocation-descriptor+xml 'IANA,[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.oma.poc.optimized-progress-report+xml 'IANA,[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.oma.xcap-directory+xml 'IANA,[Kelley],[OMA Presence and Availability (PAG) Working Group]\n\
application/vnd.omads-email+xml 'IANA,[OMA Data Synchronization Working Group]\n\
application/vnd.omads-file+xml 'IANA,[OMA Data Synchronization Working Group]\n\
application/vnd.omads-folder+xml 'IANA,[OMA Data Synchronization Working Group]\n\
application/vnd.omaloc-supl-init 'IANA,[Grange]\n\
application/vnd.openofficeorg.extension 'IANA,[Lingner]\n\
application/vnd.osa.netdeploy 'IANA,[Klos]\n\
application/vnd.osgi.bundle 'IANA,[Kriens]\n\
application/vnd.osgi.dp 'IANA,[Kriens]\n\
application/vnd.otps.ct-kip+xml 'IANA,[Nyström=Nystrom]\n\
application/vnd.palm @prc,pdb,pqa,oprc :base64 'IANA,[Peacock]\n\
application/vnd.paos.xml 'IANA,[Kemp]\n\
application/vnd.pg.format 'IANA,[Gandert]\n\
application/vnd.pg.osasli 'IANA,[Gandert]\n\
application/vnd.piaccess.application-licence 'IANA,[Maneos]\n\
application/vnd.picsel @efif 'IANA,[Naccarato]\n\
application/vnd.poc.group-advertisement+xml 'IANA,[Kelley],[OMA Push to Talk over Cellular (POC) Working Group]\n\
application/vnd.pocketlearn 'IANA,[Pando]\n\
application/vnd.powerbuilder6 'IANA,[Guy]\n\
application/vnd.powerbuilder6-s 'IANA,[Guy]\n\
application/vnd.powerbuilder7 'IANA,[Shilts]\n\
application/vnd.powerbuilder7-s 'IANA,[Shilts]\n\
application/vnd.powerbuilder75 'IANA,[Shilts]\n\
application/vnd.powerbuilder75-s 'IANA,[Shilts]\n\
application/vnd.preminet 'IANA,[Tenhunen]\n\
application/vnd.previewsystems.box 'IANA,[Smolgovsky]\n\
application/vnd.proteus.magazine 'IANA,[Hoch]\n\
application/vnd.publishare-delta-tree 'IANA,[Ben-Kiki]\n\
application/vnd.pvi.ptid1 @pti,ptid 'IANA,[Lamb]\n\
application/vnd.pwg-multiplexed 'IANA,RFC3391\n\
application/vnd.pwg-xhtml-print+xml 'IANA,[Wright]\n\
application/vnd.qualcomm.brew-app-res 'IANA,[Forrester]\n\
application/vnd.Quark.QuarkXPress @qxd,qxt,qwd,qwt,qxl,qxb :8bit 'IANA,[Scheidler]\n\
application/vnd.rapid 'IANA,[Szekely]\n\
application/vnd.recordare.musicxml 'IANA,[Good]\n\
application/vnd.recordare.musicxml+xml 'IANA,[Good]\n\
application/vnd.RenLearn.rlprint 'IANA,[Wick]\n\
application/vnd.route66.link66+xml 'IANA,[Kikstra]\n\
application/vnd.ruckus.download 'IANA,[Harris]\n\
application/vnd.s3sms 'IANA,[Tarkkala]\n\
application/vnd.sbm.cid 'IANA,[Kusakari]\n\
application/vnd.sbm.mid2 'IANA,[Murai]\n\
application/vnd.scribus 'IANA,[Bradney]\n\
application/vnd.sealed.3df 'IANA,[Kwan]\n\
application/vnd.sealed.csf 'IANA,[Kwan]\n\
application/vnd.sealed.doc @sdoc,sdo,s1w 'IANA,[Petersen]\n\
application/vnd.sealed.eml @seml,sem 'IANA,[Petersen]\n\
application/vnd.sealed.mht @smht,smh 'IANA,[Petersen]\n\
application/vnd.sealed.net 'IANA,[Lambert]\n\
application/vnd.sealed.ppt @sppt,spp,s1p 'IANA,[Petersen]\n\
application/vnd.sealed.tiff 'IANA,[Kwan],[Lambert]\n\
application/vnd.sealed.xls @sxls,sxl,s1e 'IANA,[Petersen]\n\
application/vnd.sealedmedia.softseal.html @stml,stm,s1h 'IANA,[Petersen]\n\
application/vnd.sealedmedia.softseal.pdf @spdf,spd,s1a 'IANA,[Petersen]\n\
application/vnd.seemail @see 'IANA,[Webb]\n\
application/vnd.sema 'IANA,[Hansson]\n\
application/vnd.semd 'IANA,[Hansson]\n\
application/vnd.semf 'IANA,[Hansson]\n\
application/vnd.shana.informed.formdata 'IANA,[Selzler]\n\
application/vnd.shana.informed.formtemplate 'IANA,[Selzler]\n\
application/vnd.shana.informed.interchange 'IANA,[Selzler]\n\
application/vnd.shana.informed.package 'IANA,[Selzler]\n\
application/vnd.SimTech-MindMapper 'IANA,[Koh]\n\
application/vnd.smaf @mmf 'IANA,[Takahashi]\n\
application/vnd.smart.teacher 'IANA,[Boyle]\n\
application/vnd.software602.filler.form+xml 'IANA,[Hytka],[Vondrous]\n\
application/vnd.software602.filler.form-xml-zip 'IANA,[Hytka],[Vondrous]\n\
application/vnd.solent.sdkm+xml 'IANA,[Gauntlett]\n\
application/vnd.spotfire.dxp 'IANA,[Jernberg]\n\
application/vnd.spotfire.sfs 'IANA,[Jernberg]\n\
application/vnd.sss-cod 'IANA,[Dani]\n\
application/vnd.sss-dtf 'IANA,[Bruno]\n\
application/vnd.sss-ntf 'IANA,[Bruno]\n\
application/vnd.street-stream 'IANA,[Levitt]\n\
application/vnd.sun.wadl+xml 'IANA,[Hadley]\n\
application/vnd.sus-calendar @sus,susp 'IANA,[Niedfeldt]\n\
application/vnd.svd 'IANA,[Becker]\n\
application/vnd.swiftview-ics 'IANA,[Widener]\n\
application/vnd.syncml+xml 'IANA,[OMA Data Synchronization Working Group]\n\
application/vnd.syncml.dm+wbxml 'IANA,[OMA-DM Work Group]\n\
application/vnd.syncml.dm+xml 'IANA,[Rao],[OMA-DM Work Group]\n\
application/vnd.syncml.ds.notification 'IANA,[OMA Data Synchronization Working Group]\n\
application/vnd.tao.intent-module-archive 'IANA,[Shelton]\n\
application/vnd.tmobile-livetv 'IANA,[Helin]\n\
application/vnd.trid.tpt 'IANA,[Cusack]\n\
application/vnd.triscape.mxs 'IANA,[Simonoff]\n\
application/vnd.trueapp 'IANA,[Hepler]\n\
application/vnd.truedoc 'IANA,[Chase]\n\
application/vnd.ufdl 'IANA,[Manning]\n\
application/vnd.uiq.theme 'IANA,[Ocock]\n\
application/vnd.umajin 'IANA,[Riden]\n\
application/vnd.unity 'IANA,[Unity3d]\n\
application/vnd.uoml+xml 'IANA,[Gerdes]\n\
application/vnd.uplanet.alert 'IANA,[Martin]\n\
application/vnd.uplanet.alert-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.bearer-choice 'IANA,[Martin]\n\
application/vnd.uplanet.bearer-choice-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.cacheop 'IANA,[Martin]\n\
application/vnd.uplanet.cacheop-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.channel 'IANA,[Martin]\n\
application/vnd.uplanet.channel-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.list 'IANA,[Martin]\n\
application/vnd.uplanet.list-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.listcmd 'IANA,[Martin]\n\
application/vnd.uplanet.listcmd-wbxml 'IANA,[Martin]\n\
application/vnd.uplanet.signal 'IANA,[Martin]\n\
application/vnd.vcx 'IANA,[T.Sugimoto]\n\
application/vnd.vd-study 'IANA,[Rogge]\n\
application/vnd.vectorworks 'IANA,[Ferguson],[Sarkar]\n\
application/vnd.vidsoft.vidconference @vsc :8bit 'IANA,[Hess]\n\
application/vnd.visio @vsd,vst,vsw,vss 'IANA,[Sandal]\n\
application/vnd.visionary @vis 'IANA,[Aravindakumar]\n\
application/vnd.vividence.scriptfile 'IANA,[Risher]\n\
application/vnd.vsf 'IANA,[Rowe]\n\
application/vnd.wap.sic @sic 'IANA,[WAP-Forum]\n\
application/vnd.wap.slc @slc 'IANA,[WAP-Forum]\n\
application/vnd.wap.wbxml @wbxml 'IANA,[Stark]\n\
application/vnd.wap.wmlc @wmlc 'IANA,[Stark]\n\
application/vnd.wap.wmlscriptc @wmlsc 'IANA,[Stark]\n\
application/vnd.webturbo @wtb 'IANA,[Rehem]\n\
application/vnd.wfa.wsc 'IANA,[Wi-Fi Alliance]\n\
application/vnd.wmc 'IANA,[Kjørnes=Kjornes]\n\
application/vnd.wmf.bootstrap 'IANA,[Nguyenphu],[Iyer]\n\
application/vnd.wordperfect @wpd 'IANA,[Scarborough]\n\
application/vnd.wqd @wqd 'IANA,[Bostrom]\n\
application/vnd.wrq-hp3000-labelled 'IANA,[Bartram]\n\
application/vnd.wt.stf 'IANA,[Wohler]\n\
application/vnd.wv.csp+wbxml @wv 'IANA,[Salmi]\n\
application/vnd.wv.csp+xml :8bit 'IANA,[Ingimundarson]\n\
application/vnd.wv.ssp+xml :8bit 'IANA,[Ingimundarson]\n\
application/vnd.xara 'IANA,[Matthewman]\n\
application/vnd.xfdl 'IANA,[Manning]\n\
application/vnd.xfdl.webform 'IANA,[Mansell]\n\
application/vnd.xmi+xml 'IANA,[Waskiewicz]\n\
application/vnd.xmpie.cpkg 'IANA,[Sherwin]\n\
application/vnd.xmpie.dpkg 'IANA,[Sherwin]\n\
application/vnd.xmpie.plan 'IANA,[Sherwin]\n\
application/vnd.xmpie.ppkg 'IANA,[Sherwin]\n\
application/vnd.xmpie.xlim 'IANA,[Sherwin]\n\
application/vnd.yamaha.hv-dic @hvd 'IANA,[Yamamoto]\n\
application/vnd.yamaha.hv-script @hvs 'IANA,[Yamamoto]\n\
application/vnd.yamaha.hv-voice @hvp 'IANA,[Yamamoto]\n\
application/vnd.yamaha.smaf-audio @saf 'IANA,[Shinoda]\n\
application/vnd.yamaha.smaf-phrase @spf 'IANA,[Shinoda]\n\
application/vnd.yellowriver-custom-menu 'IANA,[Yellow]\n\
application/vnd.zul 'IANA,[Grothmann]\n\
application/vnd.zzazz.deck+xml 'IANA,[Hewett]\n\
application/voicexml+xml 'IANA,RFC4267\n\
application/watcherinfo+xml @wif 'IANA,RFC3858\n\
application/whoispp-query 'IANA,RFC2957\n\
application/whoispp-response 'IANA,RFC2958\n\
application/wita 'IANA,[Campbell]\n\
application/wordperfect5.1 @wp5,wp 'IANA,[Lindner]\n\
application/wsdl+xml 'IANA,[W3C]\n\
application/wspolicy+xml 'IANA,[W3C]\n\
application/x400-bp 'IANA,RFC1494\n\
application/xcap-att+xml 'IANA,RFC4825\n\
application/xcap-caps+xml 'IANA,RFC4825\n\
application/xcap-el+xml 'IANA,RFC4825\n\
application/xcap-error+xml 'IANA,RFC4825\n\
application/xcap-ns+xml 'IANA,RFC4825\n\
application/xenc+xml 'IANA,[Reagle],[XENC Working Group]\n\
application/xhtml+xml @xhtml :8bit 'IANA,RFC3236\n\
application/xml @xml,xsl :8bit 'IANA,RFC3023\n\
application/xml-dtd @dtd :8bit 'IANA,RFC3023\n\
application/xml-external-parsed-entity 'IANA,RFC3023\n\
application/xmpp+xml 'IANA,RFC3923\n\
application/xop+xml 'IANA,[Nottingham]\n\
application/xv+xml 'IANA,RFC4374\n\
application/zip @zip :base64 'IANA,[Lindner]\n\
\n\
*mac:application/x-mac @bin :base64\n\
*mac:application/x-macbase64 @bin :base64\n\
\n\
!application/smil @smi,smil :8bit 'IANA,RFC4536 =use-instead:application/smil+xml\n\
!application/xhtml-voice+xml 'IANA,{RFC-mccobb-xplusv-media-type-04.txt=https://datatracker.ietf.org/public/idindex.cgi?command=id_detail&filename=draft-mccobb-xplusv-media-type}\n\
*!application/VMSBACKUP @bck :base64 =use-instead:application/x-VMSBACKUP\n\
*!application/access @mdf,mda,mdb,mde =use-instead:application/x-msaccess\n\
*!application/bleeper @bleep :base64 =use-instead:application/x-bleeper\n\
*!application/cals1840 'LTSW =use-instead:application/cals-1840\n\
*!application/futuresplash @spl =use-instead:application/x-futuresplash\n\
*!application/ghostview =use-instead:application/x-ghostview\n\
*!application/hep @hep =use-instead:application/x-hep\n\
*!application/imagemap @imagemap,imap :8bit =use-instead:application/x-imagemap\n\
*!application/lotus-123 @wks =use-instead:application/vnd.lotus-1-2-3\n\
*!application/mac-compactpro @cpt =use-instead:application/x-mac-compactpro\n\
*!application/mathcad @mcd :base64 =use-instead:application/vnd.mcd\n\
*!application/mathematica-old =use-instead:application/x-mathematica-old\n\
*!application/news-message-id 'IANA,RFC1036,[Spencer]\n\
*!application/quicktimeplayer @qtl =use-instead:application/x-quicktimeplayer\n\
*!application/remote_printing 'LTSW =use-instead:application/remote-printing\n\
*!application/toolbook @tbk =use-instead:application/x-toolbook\n\
*!application/vnd.ms-excel.sheet.binary.macroEnabled.12 @xlsb\n\
*!application/vnd.ms-excel.sheet.macroEnabled.12 @xlsm\n\
*!application/vnd.ms-word.document.macroEnabled.12 @docm\n\
*!application/vnd.ms-word.template.macroEnabled.12 @dotm\n\
*!application/wordperfect @wp =use-instead:application/vnd.wordperfect\n\
*!application/wordperfect6.1 @wp6 =use-instead:application/x-wordperfect6.1\n\
*!application/wordperfectd @wpd =use-instead:application/vnd.wordperfect\n\
*!application/x-123 @wk =use-instead:application/vnd.lotus-1-2-3\n\
*!application/x-access @mdf,mda,mdb,mde =use-instead:application/x-msaccess\n\
*!application/x-compress @z,Z :base64 =use-instead:application/x-compressed\n\
*!application/x-javascript @js :8bit =use-instead:application/javascript\n\
*!application/x-lotus-123 @wks =use-instead:application/vnd.lotus-1-2-3\n\
*!application/x-mathcad @mcd :base64 =use-instead:application/vnd.mcd\n\
*!application/x-msword @doc,dot,wrd :base64 =use-instead:application/msword\n\
*!application/x-rtf @rtf :base64 'LTSW =use-instead:application/rtf\n\
*!application/x-troff 'LTSW =use-instead:text/troff\n\
*!application/x-u-star 'LTSW =use-instead:application/x-ustar\n\
*!application/x-word @doc,dot :base64 =use-instead:application/msword\n\
*!application/x-wordperfect @wp =use-instead:application/vnd.wordperfect\n\
*!application/x-wordperfectd @wpd =use-instead:application/vnd.wordperfect\n\
*!application/x400.bp 'LTSW =use-instead:application/x400-bp\n\
*application/SLA 'LTSW\n\
*application/STEP 'LTSW\n\
*application/acad 'LTSW\n\
*application/appledouble :base64\n\
*application/clariscad 'LTSW\n\
*application/drafting 'LTSW\n\
*application/dxf 'LTSW\n\
*application/excel @xls,xlt 'LTSW\n\
*application/fractals 'LTSW\n\
*application/i-deas 'LTSW\n\
*application/macbinary 'LTSW\n\
*application/netcdf @nc,cdf 'LTSW\n\
*application/powerpoint @ppt,pps,pot :base64 'LTSW\n\
*application/pro_eng 'LTSW\n\
*application/set 'LTSW\n\
*application/solids 'LTSW\n\
*application/vda 'LTSW\n\
*application/vnd.openxmlformats-officedocument.presentationml.presentation @pptx\n\
*application/vnd.openxmlformats-officedocument.presentationml.slideshow @ppsx\n\
*application/vnd.openxmlformats-officedocument.spreadsheetml.sheet @xlsx :quoted-printable\n\
*application/vnd.openxmlformats-officedocument.wordprocessingml.document @docx\n\
*application/vnd.openxmlformats-officedocument.wordprocessingml.template @dotx\n\
*application/vnd.stardivision.calc @sdc\n\
*application/vnd.stardivision.chart @sds\n\
*application/vnd.stardivision.draw @sda\n\
*application/vnd.stardivision.impress @sdd\n\
*application/vnd.stardivision.math @sdf\n\
*application/vnd.stardivision.writer @sdw\n\
*application/vnd.stardivision.writer-global @sgl\n\
*application/vnd.street-stream 'IANA,[Levitt]\n\
*application/vnd.sun.wadl+xml 'IANA,[Hadley]\n\
*application/vnd.sun.xml.calc @sxc\n\
*application/vnd.sun.xml.calc.template @stc\n\
*application/vnd.sun.xml.draw @sxd\n\
*application/vnd.sun.xml.draw.template @std\n\
*application/vnd.sun.xml.impress @sxi\n\
*application/vnd.sun.xml.impress.template @sti\n\
*application/vnd.sun.xml.math @sxm\n\
*application/vnd.sun.xml.writer @sxw\n\
*application/vnd.sun.xml.writer.global @sxg\n\
*application/vnd.sun.xml.writer.template @stw\n\
*application/word @doc,dot 'LTSW\n\
*application/x-SLA\n\
*application/x-STEP\n\
*application/x-VMSBACKUP @bck :base64\n\
*application/x-Wingz @wz\n\
*application/x-bcpio @bcpio 'LTSW\n\
*application/x-bleeper @bleep :base64\n\
*application/x-bzip2 @bz2\n\
*application/x-cdlink @vcd\n\
*application/x-chess-pgn @pgn\n\
*application/x-clariscad\n\
*application/x-compressed @z,Z :base64 'LTSW\n\
*application/x-cpio @cpio :base64 'LTSW\n\
*application/x-csh @csh :8bit 'LTSW\n\
*application/x-cu-seeme @csm,cu\n\
*application/x-debian-package @deb\n\
*application/x-director @dcr,@dir,@dxr\n\
*application/x-drafting\n\
*application/x-dvi @dvi :base64 'LTSW\n\
*application/x-dxf\n\
*application/x-excel\n\
*application/x-fractals\n\
*application/x-futuresplash @spl\n\
*application/x-ghostview\n\
*application/x-gtar @gtar,tgz,tbz2,tbz :base64 'LTSW\n\
*application/x-gzip @gz :base64 'LTSW\n\
*application/x-hdf @hdf 'LTSW\n\
*application/x-hep @hep\n\
*application/x-html+ruby @rhtml :8bit\n\
*application/x-httpd-php @phtml,pht,php :8bit\n\
*application/x-ica @ica\n\
*application/x-ideas\n\
*application/x-imagemap @imagemap,imap :8bit\n\
*application/x-java-archive @jar 'LTSW\n\
*application/x-java-jnlp-file @jnlp 'LTSW\n\
*application/x-java-serialized-object @ser 'LTSW\n\
*application/x-java-vm @class 'LTSW\n\
*application/x-koan @skp,skd,skt,skm\n\
*application/x-latex @ltx,latex :8bit 'LTSW\n\
*application/x-mac-compactpro @cpt\n\
*application/x-macbinary\n\
*application/x-maker @frm,maker,frame,fm,fb,book,fbdoc =use-instead:application/vnd.framemaker\n\
*application/x-mathematica-old\n\
*application/x-mif @mif 'LTSW\n\
*application/x-msaccess @mda,mdb,mde,mdf\n\
*application/x-msdos-program @cmd,bat :8bit\n\
*application/x-msdos-program @com,exe :base64\n\
*application/x-msdownload @exe,com :base64\n\
*application/x-netcdf @nc,cdf\n\
*application/x-ns-proxy-autoconfig @pac\n\
*application/x-pagemaker @pm,pm5,pt5\n\
*application/x-perl @pl,pm :8bit\n\
*application/x-pgp\n\
*application/x-python @py :8bit\n\
*application/x-quicktimeplayer @qtl\n\
*application/x-rar-compressed @rar :base64\n\
*application/x-remote_printing\n\
*application/x-ruby @rb,rbw :8bit\n\
*application/x-set\n\
*application/x-sh @sh :8bit 'LTSW\n\
*application/x-shar @shar :8bit 'LTSW\n\
*application/x-shockwave-flash @swf\n\
*application/x-solids\n\
*application/x-spss @sav,sbs,sps,spo,spp\n\
*application/x-stuffit @sit :base64 'LTSW\n\
*application/x-sv4cpio @sv4cpio :base64 'LTSW\n\
*application/x-sv4crc @sv4crc :base64 'LTSW\n\
*application/x-tar @tar :base64 'LTSW\n\
*application/x-tcl @tcl :8bit 'LTSW\n\
*application/x-tex @tex :8bit\n\
*application/x-texinfo @texinfo,texi :8bit\n\
*application/x-toolbook @tbk\n\
*application/x-troff @t,tr,roff :8bit\n\
*application/x-troff-man @man :8bit 'LTSW\n\
*application/x-troff-me @me 'LTSW\n\
*application/x-troff-ms @ms 'LTSW\n\
*application/x-ustar @ustar :base64 'LTSW\n\
*application/x-wais-source @src 'LTSW\n\
*application/x-wordperfect6.1 @wp6\n\
*application/x-x509-ca-cert @crt :base64\n\
*application/xslt+xml @xslt :8bit\n\
\n\
  # audio/*\n\
audio/32kadpcm 'IANA,RFC2421,RFC2422\n\
audio/3gpp @3gpp 'IANA,RFC4281,RFC3839\n\
audio/3gpp2 'IANA,RFC4393,RFC4281\n\
audio/ac3 'IANA,RFC4184\n\
audio/AMR @amr :base64 'RFC4867\n\
audio/AMR-WB @awb :base64 'RFC4867\n\
audio/amr-wb+ 'IANA,RFC4352\n\
audio/asc 'IANA,RFC4695\n\
audio/basic @au,snd :base64 'IANA,RFC2045,RFC2046\n\
audio/BV16 'IANA,RFC4298\n\
audio/BV32 'IANA,RFC4298\n\
audio/clearmode 'IANA,RFC4040\n\
audio/CN 'IANA,RFC3389\n\
audio/DAT12 'IANA,RFC3190\n\
audio/dls 'IANA,RFC4613\n\
audio/dsr-es201108 'IANA,RFC3557\n\
audio/dsr-es202050 'IANA,RFC4060\n\
audio/dsr-es202211 'IANA,RFC4060\n\
audio/dsr-es202212 'IANA,RFC4060\n\
audio/DVI4 'IANA,RFC4856\n\
audio/eac3 'IANA,RFC4598\n\
audio/EVRC @evc 'IANA,RFC4788\n\
audio/EVRC-QCP 'IANA,RFC3625\n\
audio/EVRC0 'IANA,RFC4788\n\
audio/EVRC1 'IANA,RFC4788\n\
audio/EVRCB 'IANA,RFC5188\n\
audio/EVRCB0 'IANA,RFC5188\n\
audio/EVRCB1 'IANA,RFC4788\n\
audio/EVRCWB 'IANA,RFC5188\n\
audio/EVRCWB0 'IANA,RFC5188\n\
audio/EVRCWB1 'IANA,RFC5188\n\
audio/G719 'IANA,RFC5404\n\
audio/G722 'IANA,RFC4856\n\
audio/G7221 'IANA,RFC3047\n\
audio/G723 'IANA,RFC4856\n\
audio/G726-16 'IANA,RFC4856\n\
audio/G726-24 'IANA,RFC4856\n\
audio/G726-32 'IANA,RFC4856\n\
audio/G726-40 'IANA,RFC4856\n\
audio/G728 'IANA,RFC4856\n\
audio/G729 'IANA,RFC4856\n\
audio/G7291 'IANA,RFC4749,RFC5459\n\
audio/G729D 'IANA,RFC4856\n\
audio/G729E 'IANA,RFC4856\n\
audio/GSM 'IANA,RFC4856\n\
audio/GSM-EFR 'IANA,RFC4856\n\
audio/iLBC 'IANA,RFC3952\n\
audio/L16 @l16 'IANA,RFC4856\n\
audio/L20 'IANA,RFC3190\n\
audio/L24 'IANA,RFC3190\n\
audio/L8 'IANA,RFC4856\n\
audio/LPC 'IANA,RFC4856\n\
audio/mobile-xmf 'IANA,RFC4723\n\
audio/mp4 'IANA,RFC4337\n\
audio/MP4A-LATM 'IANA,RFC3016\n\
audio/MPA 'IANA,RFC3555\n\
audio/mpa-robust 'IANA,RFC5219\n\
audio/mpeg @mpga,mp2,mp3 :base64 'IANA,RFC3003\n\
audio/mpeg4-generic 'IANA,RFC3640\n\
audio/ogg 'IANA,RFC5334\n\
audio/parityfec 'IANA,RFC5109\n\
audio/PCMA 'IANA,RFC4856\n\
audio/PCMA-WB 'IANA,RFC5391\n\
audio/PCMU 'IANA,RFC4856\n\
audio/PCMU-WB 'IANA,RFC5391\n\
audio/prs.sid 'IANA,[Walleij]\n\
audio/QCELP 'IANA,RFC3555,RFC3625\n\
audio/RED 'IANA,RFC3555\n\
audio/rtp-enc-aescm128 'IANA,[3GPP]\n\
audio/rtp-midi 'IANA,RFC4695\n\
audio/rtx 'IANA,RFC4588\n\
audio/SMV @smv 'IANA,RFC3558\n\
audio/SMV-QCP 'IANA,RFC3625\n\
audio/SMV0 'IANA,RFC3558\n\
audio/sp-midi 'IANA,[Kosonen],[T. White=T.White]\n\
audio/t140c 'IANA,RFC4351\n\
audio/t38 'IANA,RFC4612\n\
audio/telephone-event 'IANA,RFC4733\n\
audio/tone 'IANA,RFC4733\n\
audio/ulpfec 'IANA,RFC5109\n\
audio/VDVI 'IANA,RFC4856\n\
audio/VMR-WB 'IANA,RFC4348,RFC4424\n\
audio/vnd.3gpp.iufp 'IANA,[Belling]\n\
audio/vnd.4SB 'IANA,[De Jaham]\n\
audio/vnd.audiokoz 'IANA,[DeBarros]\n\
audio/vnd.CELP 'IANA,[De Jaham]\n\
audio/vnd.cisco.nse 'IANA,[Kumar]\n\
audio/vnd.cmles.radio-events 'IANA,[Goulet]\n\
audio/vnd.cns.anp1 'IANA,[McLaughlin]\n\
audio/vnd.cns.inf1 'IANA,[McLaughlin]\n\
audio/vnd.digital-winds @eol :7bit 'IANA,[Strazds]\n\
audio/vnd.dlna.adts 'IANA,[Heredia]\n\
audio/vnd.dolby.mlp 'IANA,[Ward]\n\
audio/vnd.dolby.mps 'IANA,[Hattersley]\n\
audio/vnd.dts 'IANA,[Zou]\n\
audio/vnd.dts.hd 'IANA,[Zou]\n\
audio/vnd.everad.plj @plj 'IANA,[Cicelsky]\n\
audio/vnd.hns.audio 'IANA,[Swaminathan]\n\
audio/vnd.lucent.voice @lvp 'IANA,[Vaudreuil]\n\
audio/vnd.ms-playready.media.pya 'IANA,[DiAcetis]\n\
audio/vnd.nokia.mobile-xmf @mxmf 'IANA,[Nokia Corporation=Nokia]\n\
audio/vnd.nortel.vbk @vbk 'IANA,[Parsons]\n\
audio/vnd.nuera.ecelp4800 @ecelp4800 'IANA,[Fox]\n\
audio/vnd.nuera.ecelp7470 @ecelp7470 'IANA,[Fox]\n\
audio/vnd.nuera.ecelp9600 @ecelp9600 'IANA,[Fox]\n\
audio/vnd.octel.sbc 'IANA,[Vaudreuil]\n\
audio/vnd.rhetorex.32kadpcm 'IANA,[Vaudreuil]\n\
audio/vnd.sealedmedia.softseal.mpeg @smp3,smp,s1m 'IANA,[Petersen]\n\
audio/vnd.vmx.cvsd 'IANA,[Vaudreuil]\n\
audio/vorbis 'IANA,RFC5215\n\
audio/vorbis-config 'IANA,RFC5215\n\
\n\
audio/x-aiff @aif,aifc,aiff :base64\n\
audio/x-midi @mid,midi,kar :base64\n\
audio/x-pn-realaudio @rm,ram :base64\n\
audio/x-pn-realaudio-plugin @rpm\n\
audio/x-realaudio @ra :base64\n\
audio/x-wav @wav :base64\n\
\n\
!audio/vnd.qcelp @qcp 'IANA,RFC3625 =use-instead:audio/QCELP\n\
\n\
  # image/*\n\
image/cgm 'IANA,[Francis]\n\
image/fits 'IANA,RFC4047\n\
image/g3fax 'IANA,RFC1494\n\
image/gif @gif :base64 'IANA,RFC2045,RFC2046\n\
image/ief @ief :base64 'IANA,RFC1314\n\
image/jp2 @jp2,jpg2 :base64 'IANA,RFC3745\n\
image/jpeg @jpeg,jpg,jpe :base64 'IANA,RFC2045,RFC2046\n\
image/jpm @jpm,jpgm :base64 'IANA,RFC3745\n\
image/jpx @jpx,jpf :base64 'IANA,RFC3745\n\
image/naplps 'IANA,[Ferber]\n\
image/png @png :base64 'IANA,[Randers-Pehrson]\n\
image/prs.btif 'IANA,[Simon]\n\
image/prs.pti 'IANA,[Laun]\n\
image/t38 'IANA,RFC3362\n\
image/tiff @tiff,tif :base64 'IANA,RFC2302\n\
image/tiff-fx 'IANA,RFC3950\n\
image/vnd.adobe.photoshop 'IANA,[Scarborough]\n\
image/vnd.cns.inf2 'IANA,[McLaughlin]\n\
image/vnd.djvu @djvu,djv 'IANA,[Bottou]\n\
image/vnd.dwg @dwg 'IANA,[Moline]\n\
image/vnd.dxf 'IANA,[Moline]\n\
image/vnd.fastbidsheet 'IANA,[Becker]\n\
image/vnd.fpx 'IANA,[Spencer]\n\
image/vnd.fst 'IANA,[Fuldseth]\n\
image/vnd.fujixerox.edmics-mmr 'IANA,[Onda]\n\
image/vnd.fujixerox.edmics-rlc 'IANA,[Onda]\n\
image/vnd.globalgraphics.pgb @pgb 'IANA,[Bailey]\n\
image/vnd.microsoft.icon @ico 'IANA,[Butcher]\n\
image/vnd.mix 'IANA,[Reddy]\n\
image/vnd.ms-modi @mdi 'IANA,[Vaughan]\n\
image/vnd.net-fpx 'IANA,[Spencer]\n\
image/vnd.sealed.png @spng,spn,s1n 'IANA,[Petersen]\n\
image/vnd.sealedmedia.softseal.gif @sgif,sgi,s1g 'IANA,[Petersen]\n\
image/vnd.sealedmedia.softseal.jpg @sjpg,sjp,s1j 'IANA,[Petersen]\n\
image/vnd.svf 'IANA,[Moline]\n\
image/vnd.wap.wbmp @wbmp 'IANA,[Stark]\n\
image/vnd.xiff 'IANA,[S.Martin]\n\
\n\
*!image/bmp @bmp =use-instead:image/x-bmp\n\
*!image/cmu-raster =use-instead:image/x-cmu-raster\n\
*!image/targa @tga =use-instead:image/x-targa\n\
*!image/vnd.dgn @dgn =use-instead:image/x-vnd.dgn\n\
*!image/vnd.net.fpx =use-instead:image/vnd.net-fpx\n\
*image/pjpeg :base64 =Fixes a bug with IE6 and progressive JPEGs\n\
*image/svg+xml @svg :8bit\n\
*image/x-bmp @bmp\n\
*image/x-cmu-raster @ras\n\
*image/x-paintshoppro @psp,pspimage :base64\n\
*image/x-pict\n\
*image/x-portable-anymap @pnm :base64\n\
*image/x-portable-bitmap @pbm :base64\n\
*image/x-portable-graymap @pgm :base64\n\
*image/x-portable-pixmap @ppm :base64\n\
*image/x-rgb @rgb :base64\n\
*image/x-targa @tga\n\
*image/x-vnd.dgn @dgn\n\
*image/x-win-bmp\n\
*image/x-xbitmap @xbm :7bit\n\
*image/x-xbm @xbm :7bit\n\
*image/x-xpixmap @xpm :8bit\n\
*image/x-xwindowdump @xwd :base64\n\
\n\
  # message/*\n\
message/CPIM 'IANA,RFC3862\n\
message/delivery-status 'IANA,RFC1894\n\
message/disposition-notification 'IANA,RFC2298\n\
message/external-body :8bit 'IANA,RFC2045,RFC2046\n\
message/global 'IANA,RFC5335\n\
message/global-delivery-status 'IANA,RFC5337\n\
message/global-disposition-notification 'IANA,RFC5337\n\
message/global-headers 'IANA,RFC5337\n\
message/http 'IANA,RFC2616\n\
message/imdn+xml 'IANA,RFC5438\n\
message/news :8bit 'IANA,RFC1036,[H.Spencer]\n\
message/partial :8bit 'IANA,RFC2045,RFC2046\n\
message/rfc822 @eml :8bit 'IANA,RFC2045,RFC2046\n\
message/s-http 'IANA,RFC2660\n\
message/sip 'IANA,RFC3261\n\
message/sipfrag 'IANA,RFC3420\n\
message/tracking-status 'IANA,RFC3886\n\
message/vnd.si.simp 'IANA,[Parks Young=ParksYoung]\n\
\n\
  # model/*\n\
model/iges @igs,iges 'IANA,[Parks]\n\
model/mesh @msh,mesh,silo 'IANA,RFC2077\n\
model/vnd.dwf 'IANA,[Pratt]\n\
model/vnd.flatland.3dml 'IANA,[Powers]\n\
model/vnd.gdl 'IANA,[Babits]\n\
model/vnd.gs-gdl 'IANA,[Babits]\n\
model/vnd.gtw 'IANA,[Ozaki]\n\
model/vnd.moml+xml 'IANA,[Brooks]\n\
model/vnd.mts 'IANA,[Rabinovitch]\n\
model/vnd.parasolid.transmit.binary @x_b,xmt_bin 'IANA,[Parasolid]\n\
model/vnd.parasolid.transmit.text @x_t,xmt_txt :quoted-printable 'IANA,[Parasolid]\n\
model/vnd.vtu 'IANA,[Rabinovitch]\n\
model/vrml @wrl,vrml 'IANA,RFC2077\n\
\n\
  # multipart/*\n\
multipart/alternative :8bit 'IANA,RFC2045,RFC2046\n\
multipart/appledouble :8bit 'IANA,[Faltstrom]\n\
multipart/byteranges 'IANA,RFC2068\n\
multipart/digest :8bit 'IANA,RFC2045,RFC2046\n\
multipart/encrypted 'IANA,RFC1847\n\
multipart/form-data 'IANA,RFC2388\n\
multipart/header-set 'IANA,[Crocker]\n\
multipart/mixed :8bit 'IANA,RFC2045,RFC2046\n\
multipart/parallel :8bit 'IANA,RFC2045,RFC2046\n\
multipart/related 'IANA,RFC2387\n\
multipart/report 'IANA,RFC3462\n\
multipart/signed 'IANA,RFC1847\n\
multipart/voice-message 'IANA,RFC2421,RFC2423\n\
*multipart/x-gzip\n\
*multipart/x-mixed-replace\n\
*multipart/x-tar\n\
*multipart/x-ustar\n\
*multipart/x-www-form-urlencoded\n\
*multipart/x-zip\n\
*!multipart/x-parallel =use-instead:multipart/parallel\n\
\n\
  # text/*\n\
text/calendar 'IANA,RFC2445\n\
text/css @css :8bit 'IANA,RFC2318\n\
text/csv @csv :8bit 'IANA,RFC4180\n\
text/directory 'IANA,RFC2425\n\
text/dns 'IANA,RFC4027\n\
text/enriched 'IANA,RFC1896\n\
text/html @html,htm,htmlx,shtml,htx :8bit 'IANA,RFC2854\n\
text/parityfec 'IANA,RFC5109\n\
text/plain @txt,asc,c,cc,h,hh,cpp,hpp,dat,hlp 'IANA,RFC2046,RFC3676,RFC5147\n\
text/prs.fallenstein.rst @rst 'IANA,[Fallenstein]\n\
text/prs.lines.tag 'IANA,[Lines]\n\
text/RED 'IANA,RFC4102\n\
text/rfc822-headers 'IANA,RFC3462\n\
text/richtext @rtx :8bit 'IANA,RFC2045,RFC2046\n\
text/rtf @rtf :8bit 'IANA,[Lindner]\n\
text/rtp-enc-aescm128 'IANA,[3GPP]\n\
text/rtx 'IANA,RFC4588\n\
text/sgml @sgml,sgm 'IANA,RFC1874\n\
text/t140 'IANA,RFC4103\n\
text/tab-separated-values @tsv 'IANA,[Lindner]\n\
text/troff @t,tr,roff,troff :8bit 'IANA,RFC4263\n\
text/ulpfec 'IANA,RFC5109\n\
text/uri-list 'IANA,RFC2483\n\
text/vnd.abc 'IANA,[Allen]\n\
text/vnd.curl 'IANA,[Byrnes]\n\
text/vnd.DMClientScript 'IANA,[Bradley]\n\
text/vnd.esmertec.theme-descriptor 'IANA,[Eilemann]\n\
text/vnd.fly 'IANA,[Gurney]\n\
text/vnd.fmi.flexstor 'IANA,[Hurtta]\n\
text/vnd.graphviz 'IANA,[Ellson]\n\
text/vnd.in3d.3dml 'IANA,[Powers]\n\
text/vnd.in3d.spot 'IANA,[Powers]\n\
text/vnd.IPTC.NewsML 'IANA,[IPTC]\n\
text/vnd.IPTC.NITF 'IANA,[IPTC]\n\
text/vnd.latex-z 'IANA,[Lubos]\n\
text/vnd.motorola.reflex 'IANA,[Patton]\n\
text/vnd.ms-mediapackage 'IANA,[Nelson]\n\
text/vnd.net2phone.commcenter.command @ccc 'IANA,[Xie]\n\
text/vnd.si.uricatalogue 'IANA,[Parks Young=ParksYoung]\n\
text/vnd.sun.j2me.app-descriptor @jad :8bit 'IANA,[G.Adams]\n\
text/vnd.trolltech.linguist 'IANA,[D.Lambert]\n\
text/vnd.wap.si @si 'IANA,[WAP-Forum]\n\
text/vnd.wap.sl @sl 'IANA,[WAP-Forum]\n\
text/vnd.wap.wml @wml 'IANA,[Stark]\n\
text/vnd.wap.wmlscript @wmls 'IANA,[Stark]\n\
text/xml @xml,dtd :8bit 'IANA,RFC3023\n\
text/xml-external-parsed-entity 'IANA,RFC3023\n\
\n\
vms:text/plain @doc :8bit\n\
\n\
!text/ecmascript 'IANA,RFC4329\n\
!text/javascript 'IANA,RFC4329\n\
*!text/comma-separated-values @csv :8bit =use-instead:text/csv\n\
*!text/vnd.flatland.3dml =use-instead:model/vnd.flatland.3dml\n\
*!text/x-rtf @rtf :8bit =use-instead:text/rtf\n\
*!text/x-vnd.flatland.3dml =use-instead:model/vnd.flatland.3dml\n\
*text/x-component @htc :8bit\n\
*text/x-setext @etx\n\
*text/x-vcalendar @vcs :8bit\n\
*text/x-vcard @vcf :8bit\n\
*text/x-yaml @yaml,yml :8bit\n\
\n\
  # Registered: video/*\n\
video/3gpp @3gp,3gpp 'IANA,RFC3839,RFC4281\n\
video/3gpp-tt 'IANA,RFC4396\n\
video/3gpp2 'IANA,RFC4393,RFC4281\n\
video/BMPEG 'IANA,RFC3555\n\
video/BT656 'IANA,RFC3555\n\
video/CelB 'IANA,RFC3555\n\
video/DV 'IANA,RFC3189\n\
video/H261 'IANA,RFC4587\n\
video/H263 'IANA,RFC3555\n\
video/H263-1998 'IANA,RFC4629\n\
video/H263-2000 'IANA,RFC4629\n\
video/H264 'IANA,RFC3984\n\
video/JPEG 'IANA,RFC3555\n\
video/jpeg2000 'IANA,RFC5371,RFC5372\n\
video/MJ2 @mj2,mjp2 'IANA,RFC3745\n\
video/MP1S 'IANA,RFC3555\n\
video/MP2P 'IANA,RFC3555\n\
video/MP2T 'IANA,RFC3555\n\
video/mp4 'IANA,RFC4337\n\
video/MP4V-ES 'IANA,RFC3016\n\
video/mpeg @mp2,mpe,mp3g,mpg :base64 'IANA,RFC2045,RFC2046\n\
video/mpeg4-generic 'IANA,RFC3640\n\
video/MPV 'IANA,RFC3555\n\
video/nv 'IANA,RFC4856\n\
video/ogg @ogv 'IANA,RFC5334\n\
video/parityfec 'IANA,RFC5109\n\
video/pointer 'IANA,RFC2862\n\
video/quicktime @qt,mov :base64 'IANA,[Lindner]\n\
video/raw 'IANA,RFC4175\n\
video/rtp-enc-aescm128 'IANA,[3GPP]\n\
video/rtx 'IANA,RFC4588\n\
video/SMPTE292M 'IANA,RFC3497\n\
video/ulpfec 'IANA,RFC5109\n\
video/vc1 'IANA,RFC4425\n\
video/vnd.CCTV 'IANA,[Rottmann]\n\
video/vnd.fvt 'IANA,[Fuldseth]\n\
video/vnd.hns.video 'IANA,[Swaminathan]\n\
video/vnd.iptvforum.1dparityfec-1010 'IANA,[Nakamura]\n\
video/vnd.iptvforum.1dparityfec-2005 'IANA,[Nakamura]\n\
video/vnd.iptvforum.2dparityfec-1010 'IANA,[Nakamura]\n\
video/vnd.iptvforum.2dparityfec-2005 'IANA,[Nakamura]\n\
video/vnd.iptvforum.ttsavc 'IANA,[Nakamura]\n\
video/vnd.iptvforum.ttsmpeg2 'IANA,[Nakamura]\n\
video/vnd.motorola.video 'IANA,[McGinty]\n\
video/vnd.motorola.videop 'IANA,[McGinty]\n\
video/vnd.mpegurl @mxu,m4u :8bit 'IANA,[Recktenwald]\n\
video/vnd.ms-playready.media.pyv 'IANA,[DiAcetis]\n\
video/vnd.nokia.interleaved-multimedia @nim 'IANA,[Kangaslampi]\n\
video/vnd.objectvideo @mp4 'IANA,[Clark]\n\
video/vnd.sealed.mpeg1 @s11 'IANA,[Petersen]\n\
video/vnd.sealed.mpeg4 @smpg,s14 'IANA,[Petersen]\n\
video/vnd.sealed.swf @sswf,ssw 'IANA,[Petersen]\n\
video/vnd.sealedmedia.softseal.mov @smov,smo,s1q 'IANA,[Petersen]\n\
video/vnd.vivo @viv,vivo 'IANA,[Wolfe]\n\
\n\
*!video/dl @dl :base64 =use-instead:video/x-dl\n\
*!video/gl @gl :base64 =use-instead:video/x-gl\n\
*!video/vnd.dlna.mpeg-tts 'IANA,[Heredia]\n\
*video/x-dl @dl :base64\n\
*video/x-fli @fli :base64\n\
*video/x-flv @flv :base64\n\
*video/x-gl @gl :base64\n\
*video/x-ms-asf @asf,asx\n\
*video/x-ms-wmv @wmv\n\
*video/x-msvideo @avi :base64\n\
*video/x-sgi-movie @movie :base64\n\
\n\
  # Unregistered: other/*\n\
*!chemical/x-pdb @pdb =use-instead:x-chemical/x-pdb\n\
*!chemical/x-xyz @xyz =use-instead:x-chemical/x-xyz\n\
*!drawing/dwf @dwf =use-instead:x-drawing/dwf\n\
x-chemical/x-pdb @pdb\n\
x-chemical/x-xyz @xyz\n\
x-conference/x-cooltalk @ice\n\
x-drawing/dwf @dwf\n\
x-world/x-vrml @wrl,vrml"

//
// REGULAR EXPRESSION
//

// _re = %r{
//   ^
//   ([*])?                                                   # 0: Unregistered?
//   (!)?                                                     # 1: Obsolete?
//   (?:(\n\w+):)?                                              # 2: Platform marker
//   ([-\n\w.+]+)\n\/([-\n\w.+]*)                                   # 3,4: Media type
//   (?:\n\s@([^\n\s]+))?                                         # 5: Extensions
//   (?:\n\s:((?:base64|7bit|8bit|quoted\n\-printable)))?         # 6: Encoding
//   (?:\n\s'(.+))?                                             # 7: URL list
//   (?:\n\s=(.+))?                                             # 8: Documentation
//   $
// }x

// Crazy regex to match lines
var crazy_regexp = /^([*])?(!)?(?:(\w+):)?([-\w.+]+)\/([-\w.+]*)(?:\s@([^\s]+))?(?:\s:((?:base64|7bit|8bit|quoted\-printable)))?(?:\s'(.+))?(?:\s=(.+))?$/x;
var media_type_re = /([-\w.+]+)\/([-\w.+]*)/;
var unreg_re = /[Xx]-/;

//
//  TYPE OBJECT DEFINITION
//
var MimeType = exports.MimeType = function(content_type) {
  var _content_type = content_type;
  var _extensions, _encoding, _system, _obsolete, _registered, _docs, _url;
  
  // Set up properties
  Object.defineProperty(this, "content_type", { get: function() { return _content_type; }, set: function(value) { return _content_type = value; }, enumerable: true});    
  Object.defineProperty(this, "extensions", { get: function() { return _extensions; }, set: function(value) { return _extensions = value; }, enumerable: true});    
  Object.defineProperty(this, "encoding", { get: function() { return _encoding; }, set: function(value) { return _encoding = value; }, enumerable: true});    
  Object.defineProperty(this, "system", { get: function() { return _system; }, set: function(value) { return _system = value; }, enumerable: true});    
  Object.defineProperty(this, "obsolete", { get: function() { return _obsolete; }, set: function(value) { return _obsolete = value; }, enumerable: true});    
  Object.defineProperty(this, "registered", { get: function() { return _registered; }, set: function(value) { return _registered = value; }, enumerable: true});    
  Object.defineProperty(this, "docs", { get: function() { return _docs; }, set: function(value) { return _docs = value; }, enumerable: true});    
  Object.defineProperty(this, "url", { get: function() { return _url; }, set: function(value) { return _url = value; }, enumerable: true});    
  
  Object.defineProperty(this, "simplified", { get: function() { 
      var match_data = _content_type ? _content_type.match(media_type_re) : null;
      
      if(!match_data) {
        return null;
      } else {
        var media_type = match_data[1].toLowerCase().replace(unreg_re, '');
        var sub_type = match_data[2].toLowerCase().replace(unreg_re, '');
        return media_type + "/" + sub_type;
      }
    }, enumerable: true});  
}

MimeType.prototype.has_platform = function() {
  (this.system != null) && (process.platform.match(system))
}

// 
// METHODS FOR THE OBJECT
//
var MimeTypes = exports.MimeTypes = function() {  
}

// Contains mime data by different lookups
var type_variants = MimeTypes.type_variants = {};
var extension_index = MimeTypes.extension_index = {};

//
// INITIAL PARSING CODE
//

// Chomp text removing end carriage returns
var chomp = function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}

// Store the content
var add_type_variant = function(mime_type) {
  type_variants[mime_type.simplified] = type_variants[mime_type.simplified] ? type_variants[mime_type.simplified] : [];
  type_variants[mime_type.simplified].push(mime_type)
}

var index_extensions = function(mime_type) {
  if(mime_type.extensions) {
    mime_type.extensions.forEach(function(extension) {
      extension_index[extension] = extension_index[extension] ? extension_index[extension] : [];
      extension_index[extension].push(mime_type);
    });    
  }
}

// Parse all the mime types
var parse_mimetypes = function() {
  // Split the data into it's seperate parts
  var items = mime_definition.split('\n');
  var index = 0;
  items.forEach(function(item) {
    item = chomp(item).trim().replace(/#.*/g, '');
    if(item.length > 0) {
      // Parse the item into it's individual pieces
      var parts = item.match(crazy_regexp);
      // Unpack the variables
      var unregistered = parts[1];
      var obsolete = parts[2];
      var platform = parts[3];
      var mediatype = parts[4];
      var subtype = parts[5];
      var extensions = parts[6];
      var encoding = parts[7];
      var urls = parts[8];
      var docs = parts[9];
      
      // Further process data
      extensions = extensions ? extensions.split(",") : extensions;
      urls = urls ? urls.split(",") : urls;
      
      // Create mime types
      var mime_type = new MimeType(mediatype + "/" + subtype);
      mime_type.extensions = extensions;
      mime_type.encoding = encoding;
      mime_type.system = platform;
      mime_type.obsolete = obsolete;
      mime_type.registered = unregistered == null ? false : unregistered;
      mime_type.docs = docs;
      mime_type.url = urls;

      // Save the entry as a new object
      add_type_variant(mime_type);
      index_extensions(mime_type);
    }    
    // Update the index location
    index = index + 1;
  })
}

//
//  Additional Mime Type operations
//
MimeTypes.type_for = function(filename, platform) {
  platform = platform == null ? false : platform;
  var ext = chomp(filename).toLowerCase().replace(/.*\./o, '');
  var list = extension_index[ext];
  // Filter out entries if we have a specific platform
  if(platform) {
    list = list.filter(function(mime_type) {
      return !mime_type.has_platform();
    })    
  }
  // Return the list
  return list;
}

// Only parse the mime types at the start
parse_mimetypes();



















