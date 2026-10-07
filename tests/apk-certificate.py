"""Compare v2 signer certificates to verify that an APK can update the installed app."""
import hashlib,struct,sys
from pathlib import Path

def certificate(apk):
    raw=Path(apk).read_bytes()
    eocd=raw.rfind(b'PK\x05\x06',max(0,len(raw)-65557))
    if eocd<0: raise ValueError('missing zip end')
    central=struct.unpack_from('<I',raw,eocd+16)[0]
    if raw[central-16:central]!=b'APK Sig Block 42':raise ValueError('missing APK signing block')
    size=struct.unpack_from('<Q',raw,central-24)[0]
    start=central-size-8
    if struct.unpack_from('<Q',raw,start)[0]!=size:raise ValueError('bad signing block')
    pos=start+8
    def part(data,offset=0):
        size=struct.unpack_from('<I',data,offset)[0]
        return data[offset+4:offset+4+size],offset+4+size
    while pos<central-24:
        length=struct.unpack_from('<Q',raw,pos)[0];pos+=8
        identifier=struct.unpack_from('<I',raw,pos)[0]
        if identifier==0x7109871a:
            signers,_=part(raw[pos+4:pos+length]);signer,_=part(signers)
            signed,_=part(signer);digests,next_offset=part(signed);certs,_=part(signed,next_offset)
            cert,_=part(certs);return hashlib.sha256(cert).hexdigest()
        pos+=length
    raise ValueError('missing v2 signature')

if __name__=='__main__':
    fingerprints=[certificate(path) for path in sys.argv[1:]]
    for path,fingerprint in zip(sys.argv[1:],fingerprints):print(Path(path).name,fingerprint)
    if len(set(fingerprints))>1:raise SystemExit('APK update signing certificate differs')
    print('PASS APK v2 signing certificate matches')
