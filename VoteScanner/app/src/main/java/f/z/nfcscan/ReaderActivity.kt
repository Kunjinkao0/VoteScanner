package f.z.nfcscan

import android.app.PendingIntent
import android.content.Intent
import android.media.MediaPlayer
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class ReaderActivity : AppCompatActivity() {
    private var nfcPendingIntent: PendingIntent? = null
    private var nfcAdapter: NfcAdapter? = null

    private lateinit var tagInfoTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_reader)

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        tagInfoTextView = findViewById<TextView>(R.id.result)

        nfcPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_MUTABLE
        )
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_TAG_DISCOVERED == intent.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            val deviceId = bytesToHexString(tag?.id)
            tagInfoTextView.text = "Voting..."
            voteCall(deviceId)
        }
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableForegroundDispatch(this, nfcPendingIntent, null, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    private fun updateTextView(result: String) {
        runOnUiThread {
            tagInfoTextView.text = result
        }
    }

    private fun playSoundEffect(audioResourceId: Int) {
        val mediaPlayer = MediaPlayer.create(this, audioResourceId)
        mediaPlayer.start()
        mediaPlayer.setOnCompletionListener { mediaPlayer.release() }
    }

    private fun voteCall(deviceId: String) {
        val url = "${API_HOST}/vote/submit?deviceId=${deviceId}"
        val client = OkHttpClient()
        val request = Request.Builder().url(url).get().build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
                playSoundEffect(R.raw.read_invalid)
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    updateTextView("Succeed\n${deviceId}")
                    playSoundEffect(R.raw.read_success)
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                    updateTextView("Failed\n${data}")
                    playSoundEffect(R.raw.read_invalid)
                }
            }
        })
    }
}