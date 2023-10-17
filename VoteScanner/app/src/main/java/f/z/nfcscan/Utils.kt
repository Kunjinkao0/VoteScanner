object Utils {
    @JvmStatic
    fun bytesToHexString(src: ByteArray?): String? {
        val stringBuilder = StringBuilder("0x")
        if (src == null || src.size <= 0) {
            return null
        }
        val buffer = CharArray(2)
        for (i in src.indices) {
            buffer[0] = Character.forDigit(src[i].toInt() ushr 4 and 0x0F, 16)
            buffer[1] = Character.forDigit(src[i].toInt() and 0x0F, 16)
            println(buffer)
            stringBuilder.append(buffer)
        }
        return stringBuilder.toString()
    }
}