package f.z.nfcscan

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class ControllerActivity : AppCompatActivity() {

    private lateinit var startBtn: Button
    private lateinit var nextBtn: Button
    private lateinit var statusTv: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_controller)

        statusTv = findViewById<TextView>(R.id.status)

        startBtn = findViewById<Button>(R.id.start)
        startBtn.setOnClickListener {
            startVote()
        }
        nextBtn = findViewById<Button>(R.id.next)
        nextBtn.setOnClickListener {
            nextVote()
        }

        getCurrentVoting();
    }

    private fun updateTextView(result: String) {
        runOnUiThread {
            statusTv.text = result
        }
    }

    private fun getCurrentVoting() {
        val url = "$API_HOST/vote/current";
        val client = OkHttpClient();
        val request = Request.Builder().url(url).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    updateTextView(data)
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                }
            }
        })
    }

    private fun startVote() {
        val url = "$API_HOST/vote/start";
        val client = OkHttpClient();
        val request = Request.Builder().url(url).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    getCurrentVoting()
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                }
            }
        })
    }

    private fun nextVote() {
        val url = "$API_HOST/vote/next";
        val client = OkHttpClient();
        val request = Request.Builder().url(url).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG_OKHTTP, e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                val data = response.body!!.string()
                if (response.isSuccessful) {
                    Log.v(TAG_OKHTTP, data)
                    getCurrentVoting()
                } else {
                    Log.e(TAG_OKHTTP, "ERROR in ${url}: ${response.message}")
                    Log.e(TAG_OKHTTP, data)
                }
            }
        })
    }
}